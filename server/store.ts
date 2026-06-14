import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { Pool } from "pg";
import { collections, type AppData, type CollectionName, type EntityRecord, type Store } from "./types.js";
import { createSeedData, ensureAdminCredentials } from "./seed.js";

const now = () => new Date().toISOString();

const ensureCollection = (collection: CollectionName) => {
  if (!collections.includes(collection)) {
    throw new Error(`Unknown collection: ${collection}`);
  }
};

export class JsonFileStore implements Store {
  private filePath: string;
  private data: AppData | undefined;

  constructor(filePath = path.join(process.env.VERCEL ? "/tmp" : process.cwd(), "data", "mes-demo.json")) {
    this.filePath = filePath;
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.data = JSON.parse(raw) as AppData;
      ensureAdminCredentials(this.data);
      await this.persist();
    } catch {
      this.data = createSeedData();
      ensureAdminCredentials(this.data);
      await this.persist();
    }
  }

  async list(collection: CollectionName) {
    ensureCollection(collection);
    return [...this.getData()[collection]].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  async get(collection: CollectionName, id: string) {
    ensureCollection(collection);
    return this.getData()[collection].find((item) => item.id === id);
  }

  async create(collection: CollectionName, data: Record<string, unknown>) {
    ensureCollection(collection);
    const item: EntityRecord = { id: nanoid(10), createdAt: now(), updatedAt: now(), ...data };
    this.getData()[collection].push(item);
    await this.persist();
    return item;
  }

  async update(collection: CollectionName, id: string, patch: Record<string, unknown>) {
    ensureCollection(collection);
    const list = this.getData()[collection];
    const index = list.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Record not found");
    list[index] = { ...list[index], ...patch, id, updatedAt: now() };
    await this.persist();
    return list[index];
  }

  async remove(collection: CollectionName, id: string) {
    ensureCollection(collection);
    const list = this.getData()[collection];
    this.getData()[collection] = list.filter((item) => item.id !== id);
    await this.persist();
  }

  async replaceAll(data: AppData) {
    this.data = data;
    await this.persist();
  }

  private getData() {
    if (!this.data) throw new Error("Store not initialized");
    return this.data;
  }

  private async persist() {
    if (!this.data) return;
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }
}

export class PostgresStore implements Store {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async init() {
    await this.pool.query(`
      create table if not exists app_records (
        id text primary key,
        collection text not null,
        data jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
      create index if not exists app_records_collection_idx on app_records(collection);
    `);
    const { rows } = await this.pool.query("select count(*)::int as count from app_records where collection = 'users'");
    if (rows[0]?.count === 0) await this.replaceAll(createSeedData());
    else {
      const allData = Object.fromEntries(
        await Promise.all(collections.map(async (collection) => [collection, await this.list(collection)]))
      ) as AppData;
      ensureAdminCredentials(allData);
      await this.replaceAll(allData);
    }
  }

  async list(collection: CollectionName) {
    ensureCollection(collection);
    const { rows } = await this.pool.query(
      "select id, data, created_at, updated_at from app_records where collection = $1 order by updated_at desc",
      [collection]
    );
    return rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      ...row.data
    }));
  }

  async get(collection: CollectionName, id: string) {
    ensureCollection(collection);
    const { rows } = await this.pool.query(
      "select id, data, created_at, updated_at from app_records where collection = $1 and id = $2 limit 1",
      [collection, id]
    );
    const row = rows[0];
    if (!row) return undefined;
    return {
      id: row.id,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      ...row.data
    };
  }

  async create(collection: CollectionName, data: Record<string, unknown>) {
    ensureCollection(collection);
    const id = nanoid(10);
    const timestamp = now();
    const payload = { ...data };
    await this.pool.query(
      "insert into app_records(id, collection, data, created_at, updated_at) values($1, $2, $3, $4, $5)",
      [id, collection, payload, timestamp, timestamp]
    );
    return { id, createdAt: timestamp, updatedAt: timestamp, ...payload };
  }

  async update(collection: CollectionName, id: string, patch: Record<string, unknown>) {
    const existing = await this.get(collection, id);
    if (!existing) throw new Error("Record not found");
    const { createdAt, updatedAt, ...withoutMeta } = existing;
    const payload = { ...withoutMeta, ...patch };
    const timestamp = now();
    await this.pool.query(
      "update app_records set data = $1, updated_at = $2 where collection = $3 and id = $4",
      [payload, timestamp, collection, id]
    );
    return { ...payload, id, createdAt, updatedAt: timestamp };
  }

  async remove(collection: CollectionName, id: string) {
    ensureCollection(collection);
    await this.pool.query("delete from app_records where collection = $1 and id = $2", [collection, id]);
  }

  async replaceAll(data: AppData) {
    await this.pool.query("delete from app_records");
    for (const collection of collections) {
      for (const item of data[collection]) {
        const { id, createdAt, updatedAt, ...payload } = item;
        await this.pool.query(
          "insert into app_records(id, collection, data, created_at, updated_at) values($1, $2, $3, $4, $5)",
          [id, collection, payload, createdAt, updatedAt]
        );
      }
    }
  }
}

export const createStore = () =>
  process.env.DATABASE_URL ? new PostgresStore(process.env.DATABASE_URL) : new JsonFileStore();
