function FileUpload({ name, accept, ...props }) {
  return (
    <div className="file-upload">
      <input type="file" name={name} accept={accept} {...props} />
    </div>
  )
}

export default FileUpload
