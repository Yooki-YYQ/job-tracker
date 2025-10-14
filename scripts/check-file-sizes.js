#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File size limits
const LIMITS = {
  'App.tsx': 20,
  'Container Components': 200,
  'Presentational Components': 100,
  'Custom Hooks': 150,
  'Service Files': 100,
  'Type Files': 200,
  'Config Files': 100,
  'Default': 200
};

// Get file type based on path and name
function getFileType(filePath, fileName) {
  if (fileName === 'App.tsx') return 'App.tsx';
  if (filePath.includes('/hooks/') || filePath.includes('\\hooks\\')) return 'Custom Hooks';
  if (filePath.includes('/services/') || filePath.includes('\\services\\')) return 'Service Files';
  if (filePath.includes('/types/') || filePath.includes('\\types\\')) return 'Type Files';
  if (filePath.includes('/config/') || filePath.includes('\\config\\')) return 'Config Files';
  if (filePath.includes('/components/') || filePath.includes('\\components\\')) return 'Presentational Components';
  if (filePath.includes('/modals/') || filePath.includes('\\modals\\')) return 'Container Components';
  if (filePath.includes('/pages/') || filePath.includes('\\pages\\')) return 'Container Components';
  if (filePath.includes('/features/') || filePath.includes('\\features\\')) return 'Container Components';
  return 'Default';
}

// Count lines in file
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

// Check file sizes
function checkFileSizes(dir, violations = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkFileSizes(filePath, violations);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const lineCount = countLines(filePath);
      const fileType = getFileType(filePath, file);
      const limit = LIMITS[fileType] || LIMITS.Default;
      
      if (lineCount > limit) {
        violations.push({
          file: filePath,
          lines: lineCount,
          limit: limit,
          type: fileType,
          excess: lineCount - limit
        });
      }
    }
  }
  
  return violations;
}

// Main execution
function main() {
  console.log('🔍 Checking file sizes...\n');
  
  const srcDir = path.join(__dirname, '..', 'frontend', 'src');
  const violations = checkFileSizes(srcDir);
  
  if (violations.length === 0) {
    console.log('✅ All files are within size limits!');
    process.exit(0);
  }
  
  console.log('❌ File size violations found:\n');
  
  violations.forEach(violation => {
    console.log(`🚨 ${violation.file}`);
    console.log(`   Type: ${violation.type}`);
    console.log(`   Lines: ${violation.lines} (Limit: ${violation.limit})`);
    console.log(`   Excess: +${violation.excess} lines`);
    console.log('');
  });
  
  console.log(`\n❌ Total violations: ${violations.length}`);
  console.log('🔧 Please refactor these files to meet size requirements.');
  
  process.exit(1);
}

main();

