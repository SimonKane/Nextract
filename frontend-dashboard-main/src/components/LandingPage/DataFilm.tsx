"use client";

import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";

import productStillLife from "../../public/nextract-nordic-products.png";

const fields = [
  { key: "supplier_ref", value: "SE-4819-A", keep: false },
  { key: "name", value: "Ceramic table lamp", keep: true },
  { key: "warehouse_bin", value: "B-14", keep: false },
  { key: "price", value: "1 249 SEK", keep: true },
  { key: "stock", value: "12", keep: true },
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export function DataFilm() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#e9f1f7",
        color: "#091e43",
        fontFamily: "Manrope, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "57%",
          padding: "74px 54px",
          background: "#f9fbfd",
          borderRight: "2px solid #091e43",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17 }}>
          <strong>Product 002</strong>
          <span style={{ color: "#657069" }}>5 source fields</span>
        </div>

        <div style={{ marginTop: 72 }}>
          {fields.map((field, index) => {
            const from = 12 + index * 7;
            const rejected = !field.keep;
            return (
              <div
                key={field.key}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1fr 1.35fr",
                  gap: 24,
                  alignItems: "center",
                  minHeight: 74,
                  borderTop: "1px solid #b7bdb8",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 17,
                  opacity: interpolate(
                    frame,
                    rejected ? [from, from + 12, 115, 135] : [from, from + 12],
                    rejected ? [0.56, 1, 1, 0.18] : [0.56, 1],
                    { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }
                  ),
                  translate: `${interpolate(frame, [from, from + 12], [-32, 0], clamp)}px 0px`,
                }}
              >
                <span style={{ color: "#68736d" }}>{field.key}</span>
                <span>{field.value}</span>
                {rejected ? (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      width: `${interpolate(frame, [72 + index * 3, 93 + index * 3], [0, 100], clamp)}%`,
                      height: 4,
                      background: "#e86151",
                      rotate: "-1deg",
                      transformOrigin: "left center",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      width: 13,
                      height: 13,
                      background: "#00dcb7",
                      opacity: interpolate(frame, [94, 112], [0, 1], clamp),
                    }}
                  />
                )}
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid #b7bdb8" }} />
        </div>

        <p
          style={{
            margin: "52px 0 0",
            maxWidth: 420,
            fontFamily: "Manrope, Arial, sans-serif",
            fontSize: 37,
            fontWeight: 750,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            opacity: interpolate(frame, [112, 139], [0, 1], clamp),
          }}
        >
          Three useful fields.<br />One clean product.
        </p>
      </div>

      <div style={{ position: "absolute", inset: "0 0 0 57%", overflow: "hidden" }}>
        <Img
          src={productStillLife.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "56% center",
            scale: interpolate(frame, [0, 209], [1.045, 1], clamp),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "38px 42px 42px",
            background: "rgba(249,251,253,.95)",
            borderTop: "2px solid #091e43",
            translate: `0px ${interpolate(frame, [122, 152], [190, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
          }}
        >
          <span style={{ color: "#5d6862", fontSize: 14 }}>Lighting</span>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 28, marginTop: 8 }}>
            <strong style={{ fontSize: 25 }}>Ceramic table lamp</strong>
            <strong style={{ fontSize: 25, whiteSpace: "nowrap" }}>1 249 SEK</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 18, fontSize: 15 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#00dcb7" }} /> 12 in stock
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: `calc(57% - 32px)`,
          top: 35,
          width: 64,
          height: 64,
          display: "grid",
          placeItems: "center",
          background: "#091e43",
          color: "#f9fbfd",
          fontSize: 31,
          fontWeight: 700,
          rotate: `${interpolate(frame, [92, 132], [0, 45], clamp)}deg`,
        }}
      >
        ×
      </div>
    </AbsoluteFill>
  );
}
