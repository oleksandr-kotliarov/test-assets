# Iframe and widget test assets

Four dependency-free embeds for testing integration on another website:

- `iframes/basic.html` — a fixed, responsive iframe
- `iframes/interactive.html` — an iframe that reports actions and height changes with `postMessage`
- `widgets/status.js` — a configurable status card
- `widgets/feedback.js` — an interactive feedback prompt that emits a browser event

## Run locally

Serve the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/demo/` to see all four examples and copy their embed snippets.

## Test as another website

Use two terminals to serve the same files from different origins:

```sh
# Terminal 1: embed assets
python3 -m http.server 8000

# Terminal 2: consuming website
python3 -m http.server 8001
```

Then open:

```text
http://localhost:8001/demo/?assetBase=http://localhost:8000
```

The different ports count as different origins. Classic widget scripts and iframes can be loaded cross-origin without additional CORS headers.

## Interfaces

The basic iframe accepts optional `title` and `theme=dark` query parameters.

The interactive iframe accepts an optional `id` query parameter and sends messages shaped like:

```js
{
  source: 'test-assets',
  type: 'iframe:ready' | 'iframe:resize' | 'iframe:action',
  iframeId: 'your-id',
  height: 240,        // resize messages only
  action: 'notify'    // action messages only
}
```

The child cannot know every allowed parent origin, so it sends with `targetOrigin: '*'`. The consuming page must validate both `event.origin` and `event.source`, as the demo does.

Configure the status widget on its script tag:

```html
<script
  src="http://localhost:8000/widgets/status.js"
  data-label="API status"
  data-status="operational"
  data-theme="light"
></script>
```

Supported statuses are `operational`, `degraded`, and `offline`. Supported themes are `light` and `dark`; invalid values fall back to `operational` and `light`.

Configure the feedback widget similarly:

```html
<script
  src="http://localhost:8000/widgets/feedback.js"
  data-question="Was this page helpful?"
  data-theme="light"
></script>
```

It dispatches a bubbling `test-widget:feedback` event from the generated widget host:

```js
document.addEventListener('test-widget:feedback', event => {
  console.log(event.detail.value); // "yes" or "no"
});
```

Each script tag creates one widget. Add the script more than once to create independent instances. Widget styles live in Shadow DOM so host-page CSS does not leak into them.
