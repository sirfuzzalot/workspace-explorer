const process = require('process');

const path = require('path');

const fs = require('fs');

const templatePattern = /(?<template>\${(?<type>env):(?<variable>[a-zA-Z_]+)})/;

/* eslint max-classes-per-file: ["error", 2] */

class InvalidTemplateStringError extends Error {
  constructor() {
    super('Invalid Template String');
  }
}

class FolderNotFoundError extends Error {
  constructor(message) {
    super(`Folder was not Found: ${message}`);
  }
}

const resolveEnvVar = (variable) => {
  const value = process.env[variable];
  if (value === undefined) {
    throw new InvalidTemplateStringError();
  }
  return value;
};

const replaceMatch = (match, group1, group2, group3) => {
  if (group2 === 'env') {
    return resolveEnvVar(group3);
  }
  throw new InvalidTemplateStringError();
};

/**
 * Resolves the provided template path into an absolute path.
 * @param {string} filepath - unresolved path
 * @returns {string}
 */
const resolveTemplatePath = (filepath) => {
  let templateString = filepath;
  while (true) {
    const resolvedString = templateString.replace(
      templatePattern,
      replaceMatch,
    );
    if (templateString === resolvedString) {
      const resolvedPath = path.resolve(resolvedString);
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
      }
      throw new FolderNotFoundError(resolvedPath);
    }
    templateString = resolvedString;
  }
};

module.exports = resolveTemplatePath;
