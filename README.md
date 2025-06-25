# Content Keyword Checker

This is a small web tool to check if certain keywords appear in a block of content. Results are stored in a JSON file for later viewing.

## Usage

1. Start the server:
   ```bash
   node server.js
   ```
   The server runs on [http://localhost:3000](http://localhost:3000).

2. Open the above URL in your browser. Enter a title, a list of keywords (comma or newline separated) and the content. Click **Check & Save** to see results and store them.

3. Previous checks are listed at the bottom. Click an entry to load it again.

Saved checks are stored in `data.json`.
