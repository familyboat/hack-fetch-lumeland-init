const originalFetch = globalThis.fetch;
globalThis.fetch = new Proxy(originalFetch, {
  apply: (target, thisArg, args) => {
    let [resource, config] = args;

    if (typeof resource === "string") {
      resource = modifyUrl(resource);
    } else if (resource instanceof Request) {
      resource = new Request(modifyUrl(resource.url), resource);
    }

    return target.apply(thisArg, [resource, config]);
  },
});

function modifyUrl(url: string): string {
  if (url.startsWith("https://lumeland.github.io/themes/themes.json")) {
    return url.replace("https://lumeland.github.io/themes/themes.json", "https://raw.githubusercontent.com/lumeland/themes/refs/heads/main/themes.json");
  }
  return url;
}

const res = await fetch(
  `https://cdn.deno.land/lume_init/meta/versions.json`,
);
const versions = await res.json();
const { run } = await import(
  `https://deno.land/x/lume_init@${versions.latest}/mod.ts`
);
run();