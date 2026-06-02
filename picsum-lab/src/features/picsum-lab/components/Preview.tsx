type PreviewProps = {
  url: string | null
}

export function Preview({ url }: PreviewProps) {
  if (!url) {
    return <div aria-label="Preview empty" role="status" />
  }

  return <img src={url} alt="Preview" />
}
