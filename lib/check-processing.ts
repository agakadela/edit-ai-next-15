export async function checkProcessing(url: string) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
