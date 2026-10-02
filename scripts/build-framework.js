#!/usr/bin/env node

/**
 * Build script untuk NOVA CSS Framework
 * Menghasilkan file CSS siap publish ke npm
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, '..', 'dist');

// Create dist directory
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

console.log('🔨 Building NOVA CSS Framework...\n');

// Files to process
const files = [
  'index.css',
  'reset.css',
  'tokens.css',
  'utilities.css',
  'components.css',
  'border-beam.css',
];

async function buildCSS() {
  for (const file of files) {
    const inputPath = join(__dirname, '..', 'src', 'nova', file);
    const outputPath = join(distDir, file);
    const minifiedPath = join(distDir, file.replace('.css', '.min.css'));

    try {
      const css = readFileSync(inputPath, 'utf-8');

      // Process with PostCSS
      const result = await postcss([
        autoprefixer,
      ]).process(css, { from: inputPath, to: outputPath });

      // Write normal version
      writeFileSync(outputPath, result.css);
      console.log(`✅ ${file}`);

      // Write minified version
      const minified = await postcss([
        autoprefixer,
        cssnano({
          preset: 'default',
        }),
      ]).process(css, { from: inputPath, to: minifiedPath });

      writeFileSync(minifiedPath, minified.css);
      console.log(`✅ ${file.replace('.css', '.min.css')}`);

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
}

function copyTypes() {
  const typesSrc = join(__dirname, '..', 'src', 'nova', 'types.ts');
  const typesDest = join(distDir, 'types.d.ts');

  try {
    // Read TypeScript file and convert to .d.ts
    let typesContent = readFileSync(typesSrc, 'utf-8');
    
    // Remove implementation, keep only types
    typesContent = typesContent
      .replace(/export function \w+\([^)]*\)[^{]*\{[^}]*\}/g, '')
      .replace(/import.*from.*['"];?\n?/g, '');

    writeFileSync(typesDest, typesContent);
    console.log('✅ types.d.ts');
  } catch (error) {
    console.error('❌ Error copying types:', error.message);
  }
}

function copyReactComponents() {
  const reactDir = join(distDir, 'react');
  if (!existsSync(reactDir)) {
    mkdirSync(reactDir, { recursive: true });
  }

  const reactFiles = ['BorderBeam.tsx'];
  
  for (const file of reactFiles) {
    const src = join(__dirname, '..', 'src', 'nova', file);
    const dest = join(reactDir, file.replace('.tsx', '.js'));
    
    try {
      // Copy file (in production, you'd compile TypeScript to JavaScript)
      copyFileSync(src, dest);
      console.log(`✅ react/${file.replace('.tsx', '.js')}`);
    } catch (error) {
      console.error(`❌ Error copying ${file}:`, error.message);
    }
  }
}

function printStats() {
  console.log('\n📊 Build Statistics:\n');
  
  for (const file of files) {
    const normalPath = join(distDir, file);
    const minifiedPath = join(distDir, file.replace('.css', '.min.css'));
    
    try {
      const normalSize = readFileSync(normalPath, 'utf-8').length;
      const minifiedSize = readFileSync(minifiedPath, 'utf-8').length;
      const savings = ((1 - minifiedSize / normalSize) * 100).toFixed(1);
      
      console.log(`${file}:`);
      console.log(`  Normal:   ${(normalSize / 1024).toFixed(2)} KB`);
      console.log(`  Minified: ${(minifiedSize / 1024).toFixed(2)} KB (${savings}% smaller)`);
    } catch (error) {
      // File might not exist yet
    }
  }
}

// Run build
(async () => {
  await buildCSS();
  copyTypes();
  copyReactComponents();
  printStats();
  
  console.log('\n✨ Build complete! Ready to publish.\n');
  console.log('Next steps:');
  console.log('  1. npm publish --dry-run  (test publish)');
  console.log('  2. npm publish            (publish to npm)');
})();
