import Database from 'better-sqlite3'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const db = new Database(path.resolve(process.env.DATABASE_URL ?? './src/db/database.db'))

db.exec(`
    CREATE TABLE IF NOT EXISTS decisions (
        iddecision TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        contexto TEXT NOT NULL,
        area TEXT NOT NULL,
        impactoEsperado TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        responsavel TEXT NOT NULL,
        decisaoTomada TEXT,
        decidedAt TEXT,
        resultadoRevisao TEXT,
        resumoRevisao TEXT,
        aprendizado TEXT,
        proximaAcao TEXT,
        reviewedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS decision_inputs (
        idinput TEXT PRIMARY KEY,
        iddecision TEXT NOT NULL,
        tipo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        fonte TEXT NOT NULL,
        confianca TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (iddecision) REFERENCES decisions(iddecision) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);
    CREATE INDEX IF NOT EXISTS idx_decisions_area ON decisions(area);
    CREATE INDEX IF NOT EXISTS idx_decisions_impacto ON decisions(impactoEsperado);
    CREATE INDEX IF NOT EXISTS idx_inputs_decision ON decision_inputs(iddecision);
    CREATE INDEX IF NOT EXISTS idx_inputs_tipo ON decision_inputs(tipo);
`)

console.log("Database criada!")