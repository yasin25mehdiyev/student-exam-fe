import { defineConfig } from 'orval';

export default defineConfig({
  studentExam: {
    input: {
      target: './src/shared/api/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated/endpoints.ts',
      schemas: './src/shared/api/generated/models',
      client: 'angular',
      clean: true,
    },
  },
});
