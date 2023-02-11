export const normalizeImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('ipfs://')) {
    return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }

  return imageUrl
}
