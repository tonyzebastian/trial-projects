figma.showUI(__html__, { width: 400, height: 450 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "apply-gradient") {
    const { color1, color2, gradientType, noiseType, noiseOpacity } = msg.pluginMessage;  // Note the .pluginMessage

    const rect = figma.createRectangle();
    rect.resize(600, 400);

    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255
      };
    }

    rect.fills = [
      {
        type: gradientType === "linear" ? "GRADIENT_LINEAR" : "GRADIENT_RADIAL",
        gradientStops: [
          {
            position: 0,
            color: {
              r: hexToRgb(color1).r,
              g: hexToRgb(color1).g,
              b: hexToRgb(color1).b,
              a: 1
            }
          },
          {
            position: 1,
            color: {
              r: hexToRgb(color2).r,
              g: hexToRgb(color2).g,
              b: hexToRgb(color2).b,
              a: 1
            }
          }
        ],
        gradientTransform: [[1, 0, 0], [0, 1, 0]]
      }
    ];

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const imageData = ctx.createImageData(256, 256);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      let noise = noiseType === "random" ? Math.random() * 255 : (Math.random() > 0.8 ? 255 : 0);
      pixels[i] = pixels[i + 1] = pixels[i + 2] = noise;
      pixels[i + 3] = noiseOpacity * 255;
    }

    ctx.putImageData(imageData, 0, 0);
    const noiseBase64 = canvas.toDataURL();
    
    const imageHash = await figma.createImage(await (await fetch(noiseBase64)).arrayBuffer()).hash;
    rect.fills.push({ type: "IMAGE", imageHash, scaleMode: "FILL" });
    
    figma.currentPage.appendChild(rect);
    figma.closePlugin();
  }
};