type IconifySearchResponse = {
  icons?: string[];
};

const iconifySearchUrl = "https://api.iconify.design/search";
const iconifySvgUrl = "https://api.iconify.design";

export async function findSubscriptionIcon(name: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${iconifySearchUrl}?query=${encodeURIComponent(name.trim())}&limit=999`,
    );

    if (!response.ok) {
      console.warn(`Iconify search failed with status ${response.status}.`);
      return null;
    }

    const result = (await response.json()) as IconifySearchResponse;
    const icon = result.icons?.find((identifier) => identifier.startsWith("simple-icons:"))
      ?? result.icons?.[0];

    if (!icon) {
      return null;
    }

    const separatorIndex = icon.indexOf(":");
    if (separatorIndex < 1 || separatorIndex === icon.length - 1) {
      return null;
    }

    const collection = icon.slice(0, separatorIndex);
    const namePart = icon.slice(separatorIndex + 1);
    return `${iconifySvgUrl}/${collection}/${namePart}.svg?width=128&height=128&color=%23081126`;
  } catch (error) {
    console.warn("Unable to resolve a subscription icon from Iconify.", error);
    return null;
  }
}
