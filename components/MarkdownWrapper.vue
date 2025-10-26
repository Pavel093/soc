<template>
  <div class="markdown-content">
    <slot />
  </div>
</template>

<style lang="scss">
.markdown-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 2em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.3;
    color: #2c3e50;
  }

  h1 {
    font-size: 2.5em;
    margin-top: 0;
  }

  h2 {
    font-size: 2em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid #e0e0e0;
  }

  h3 {
    font-size: 1.5em;
  }

  h4 {
    font-size: 1.25em;
  }

  p {
    margin-bottom: 1.5em;
  }

  a {
    color: #3498db;
    text-decoration: none;
    border-bottom: 1px solid #3498db;
    transition: color 0.2s, border-color 0.2s;

    &:hover {
      color: #2980b9;
      border-color: #2980b9;
    }
  }

  ul, ol {
    margin-bottom: 1.5em;
    padding-left: 2em;

    li {
      margin-bottom: 0.5em;
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  blockquote {
    margin: 1.5em 0;
    padding-left: 1.5em;
    border-left: 4px solid #3498db;
    color: #666;
    font-style: italic;

    p:last-child {
      margin-bottom: 0;
    }
  }

  code {
    background: #f4f4f4;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: #2c3e50;
    color: #fff;
    padding: 1.5em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5em 0;

    code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: 0.875em;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2em 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;

    th, td {
      padding: 0.75em;
      border: 1px solid #e0e0e0;
      text-align: left;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
    }

    tr:hover {
      background: #f8f9fa;
    }
  }

  hr {
    margin: 2em 0;
    border: none;
    border-top: 1px solid #e0e0e0;
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  .alert {
    padding: 1em 1.5em;
    border-radius: 8px;
    margin: 1.5em 0;
    display: flex;
    gap: 1em;
    align-items: flex-start;

    &.info {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      color: #1976d2;
    }

    &.warning {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      color: #f57c00;
    }

    &.success {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
      color: #388e3c;
    }

    &.danger {
      background: #ffebee;
      border-left: 4px solid #f44336;
      color: #d32f2f;
    }
  }

  @media (max-width: 768px) {
    font-size: 1rem;

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.25em;
    }

    pre {
      padding: 1em;
    }

    table {
      font-size: 0.875em;
    }
  }
}
</style>