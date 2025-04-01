#!/usr/bin/env node
/**
 * JSON to JSON Schema Converter
 *
 * This script converts a JSON object to a JSON Schema.
 * Usage:
 *   node json-to-json-schema.js [input.json]
 * If an input file is provided, the script will read the JSON from the file.
 * Otherwise, it uses a default JSON example.
 */

'use strict';
const fs = require('fs');

function generateSchema(value) {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return {
        type: "array",
        items: generateSchema(value[0])
      };
    } else {
      return {
        type: "array",
        items: {}
      };
    }
  } else if (typeof value === "object" && value !== null) {
    const properties = {};
    const required = [];
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        properties[key] = generateSchema(value[key]);
        required.push(key);
      }
    }
    return {
      type: "object",
      properties: properties,
      required: required
    };
  } else {
    switch (typeof value) {
      case "string":
        return { type: "string" };
      case "number":
        return { type: "number" };
      case "boolean":
        return { type: "boolean" };
      default:
        return {};
    }
  }
}

function main() {
  let jsonData;
  const inputPath = process.argv[2];

  if (inputPath) {
    try {
      const fileContent = fs.readFileSync(inputPath, 'utf8');
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading or parsing the JSON file:', error.message);
      process.exit(1);
    }
  } else {
    // Default example JSON if no file is provided
    jsonData = {
      name: "John Doe",
      age: 30,
      isMember: true,
      hobbies: ["reading", "gaming"],
      address: {
        street: "123 Maple St",
        city: "Anytown"
      }
    };
  }

  const schema = generateSchema(jsonData);
  console.log(JSON.stringify(schema, null, 2));
}

if (require.main === module) {
  main();
}
