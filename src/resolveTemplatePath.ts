import process from "node:process";
import path from "node:path";
import fs from "node:fs";

const templatePattern = /(?<template>\${(?<type>env):(?<variable>[a-zA-Z_]+)})/;

/* eslint max-classes-per-file: ["error", 2] */

export class InvalidTemplateStringError extends Error {
  constructor() {
    super("Invalid Template String");
  }
}

class FolderNotFoundError extends Error {
  constructor(message: string) {
    super(`Folder was not Found: ${message}`);
  }
}

const resolveEnvVar = (variable: string) => {
  const value = process.env[variable];
  if (value === undefined) {
    throw new InvalidTemplateStringError();
  }
  return value;
};

const replaceMatch = (
  match: string,
  group1: string,
  group2: string,
  group3: string,
) => {
  if (group2 === "env") {
    return resolveEnvVar(group3);
  }
  throw new InvalidTemplateStringError();
};

/**
 * Resolves the provided template path into an absolute path.
 * @param {string} filepath - unresolved path
 * @returns {string}
 */
export default function (filepath: string): string {
  let templateString = filepath;
  while (true) {
    /* eslint no-constant-condition: "off" */
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
}
