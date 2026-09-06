import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const apiUrl = process.env.API_URL ?? 'http://localhost:5140';
const specUrl = `${apiUrl}/swagger/v1/swagger.json`;
const outPath = resolve(import.meta.dirname, '../src/shared/api/swagger.json');

console.log(`Fetching OpenAPI spec from ${specUrl} ...`);

const response = await fetch(specUrl);
if (!response.ok) {
  console.error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
  console.error('Is the backend running? (dotnet run --project src/StudentExam.Api)');
  process.exit(1);
}

const spec = await response.text();
writeFileSync(outPath, spec);
console.log(`Saved to ${outPath}`);
