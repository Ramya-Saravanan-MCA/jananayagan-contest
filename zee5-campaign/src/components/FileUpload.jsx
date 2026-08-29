const FileUpload = ({ file, onChange }) => {
  return (
    <div>

      <div className="mb-2 flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-400/50 text-xs text-purple-300">
          ↑
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-purple-300">
            UPLOAD YOUR SCREENSHOT
          </p>

          <p className="text-[8px] text-gray-500">
            JPG / PNG • MAX 1MB
          </p>
        </div>

      </div>


      <label
        htmlFor="screenshot"
        className="group flex h-[82px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-purple-500/50 bg-purple-950/10 transition hover:border-pink-400 hover:bg-purple-900/10"
      >

        <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full border border-purple-400/60 text-sm text-purple-300">
          ↑
        </div>

        <p className="text-[9px] font-medium text-gray-300">
          {file ? file.name : "DRAG & DROP YOUR FILE HERE"}
        </p>

        {!file && (
          <p className="mt-0.5 text-[8px] text-gray-600">
            Click to browse
          </p>
        )}

      </label>


      <input
        id="screenshot"
        type="file"
        accept="image/jpeg,image/png"
        onChange={onChange}
        className="hidden"
        required
      />

    </div>
  );
};

export default FileUpload;