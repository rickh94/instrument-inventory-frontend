const compress = (file, orientation, callback) => {
  const width = 800
  const fileName = file.name
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = event => {
    const img = new Image()
    img.src = event.target.result
    img.onload = () => {
      const elem = document.createElement("canvas")
      const scaleFactor = width / img.width
      const height = img.height * scaleFactor

      if (4 < orientation && orientation < 9) {
        elem.height = width
        elem.width = height
      } else {
        elem.height = height
        elem.width = width
      }
      const ctx = elem.getContext("2d")

      switch (orientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0)
          break
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height)
          break
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height)
          break
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0)
          break
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0)
          break
        case 7:
          ctx.transform(0, -1, -1, 0, height, width)
          break
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width)
          break
        default:
          break
      }
      ctx.drawImage(img, 0, 0, width, height)
      ctx.canvas.toBlob(blob => {
        const file = new File(
          [blob],
          `compressed-${fileName}`,
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          },
          "image/jpeg",
          0.6
        )
        callback(file)
      })
    }
  }
  reader.onerror = error => console.log(error)
}

const getOrientation = (file, callback) => {
  const reader = new FileReader()
  reader.onload = function(e) {
    const view = new DataView(e.target.result)
    if (view.getUint16(0, false) != 0xffd8) {
      return callback(-2, file)
    }
    const length = view.byteLength
    let offset = 2
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1, file)
      const marker = view.getUint16(offset, false)
      offset += 2
      if (marker == 0xffe1) {
        if (view.getUint32((offset += 2), false) != 0x45786966) {
          return callback(-1, file)
        }

        const little = view.getUint16((offset += 6), false) == 0x4949
        offset += view.getUint32(offset + 4, little)
        const tags = view.getUint16(offset, little)
        offset += 2
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little), file)
          }
        }
      } else if ((marker & 0xff00) != 0xff00) {
        break
      } else {
        offset += view.getUint16(offset, false)
      }
    }
    return callback(-1, file)
  }
  reader.readAsArrayBuffer(file)
}

const processImage = (file, callback) => {
  getOrientation(file, (orientation, file) => {
    compress(file, orientation, callback)
  })
}

export default processImage
