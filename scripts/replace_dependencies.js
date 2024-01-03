const fs = require('fs');
const path = require('path');

const mainPackageJsonPath = './packages/react/scroll-area/package.json';
const rootDir = './packages';

const readJson = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const findPackageJsonPath = (dep) => {
  let depName = dep.split('/')[1];
  if (/^react-/.test(depName)) {
    depName = depName.replace(/^react-/, '');
    return path.join(rootDir, 'react', depName, 'package.json');
  }

  return path.join(rootDir, 'core', depName, 'package.json');
};

// Main function to replace workspace dependencies
const replaceWorkspaceDependencies = () => {
  const mainPackageJson = readJson(mainPackageJsonPath);

  if (mainPackageJson.dependencies) {
    Object.keys(mainPackageJson.dependencies).forEach((dep) => {
      if (mainPackageJson.dependencies[dep].startsWith('workspace:')) {
        const depPackageJsonPath = findPackageJsonPath(dep);
        if (depPackageJsonPath) {
          const depPackageJson = readJson(depPackageJsonPath);
          mainPackageJson.dependencies[dep] = depPackageJson.version;
        } else {
          console.warn(`Warning: Could not find package.json for: ${dep}`);
        }
      }
    });

    writeJson(mainPackageJsonPath, mainPackageJson);
    console.log('Workspace dependencies have been replaced successfully.');
  }
};

replaceWorkspaceDependencies();
