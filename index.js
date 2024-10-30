/**
 *
 * @param {string | undefined} prefix string appended to each of the values
 * @param {string[]} values
 * @param {boolean | undefined} noSelf if `true`, it won't output prefix itself as separate value
 * @returns if prefix is `undefined` returns values array itself, otherwise prefixed values
 */
const _prefix = (prefix, values, noSelf) => {
  if (prefix) {
    return [
      //
      noSelf ? [] : [prefix],
      values.flat().map(v => prefix + "-" + v),
    ].flat();
  }

  return values.flat();
};

const _suffix = (values, suffix, noSelf) => {
  if (suffix) {
    return [
      noSelf ? [] : [suffix],
      values.flat().map(v => v + "-" + suffix),
    ].flat();
  }

  return values.flat();
};

/**
 * `*-top`, `*-right`, `*-bottom`, `*-left`
 * @param {string | undefined} prefix
 * @param {boolean | undefined} noSelf
 * @returns
 */
const tlrb = (prefix, noSelf) =>
  _prefix(prefix, ["top", "right", "bottom", "left"], noSelf);

/**
 * `*-start`, `*-end`
 * @param {string | undefined} prefix
 * @param {boolean | undefined} noSelf
 * @returns
 */
const se = (prefix, noSelf) => _prefix(prefix, ["start", "end"], noSelf);

/**
 * `*-inline`, `*-block`
 * @param {string | undefined} prefix
 * @param {boolean | undefined} noSelf
 * @returns
 */
const ib = (prefix, noSelf) => _prefix(prefix, ["inline", "block"], noSelf);

/**
 * `*-inline[-start/end]`, `*-block[-start/end]`
 * @param {string | undefined} prefix
 * @param {boolean | undefined} noSelf
 * @returns
 */
const ibse = (prefix, noSelf) =>
  _prefix(
    prefix,
    ib().map(v => se(v)),
    noSelf
  );

/**
 * includes prefix itself, `ibse` and `tlrb`
 * @param {string} prefix
 * @returns
 */
const pos = prefix => [prefix, ibse(prefix, true), tlrb(prefix, true)].flat();

/**
 *
 * @param {string | undefined} suffix
 * @param {boolean | undefined} noSelf
 * @returns
 */
const minMax = (suffix, noSelf) => _suffix(["min", "max"], suffix, noSelf);

/**
 * `place-*`, `align-*`, `justify-*`
 * @param {string | undefined} suffix
 * @param {boolean | undefined} noSelf
 * @returns
 */
const paj = (suffix, noSelf) =>
  _suffix(["place", "align", "justify"], suffix, noSelf);

const orderMap = {
  "css modules": ["composes"],

  pseudo: ["content"],

  appearance: [
    "all",
    "appearance",
    "visibility",
    "content-visibility",
    "contain",
    "writing-mode",
    "color-scheme",
  ],

  positioning: [
    //
    "position",
    "z-index",
    "isolation",
    ibse("inset"),
    tlrb(),
  ],

  container: [
    "display",

    _prefix("flex", ["flow", "direction", "wrap"], true),

    _prefix("grid", [
      _prefix("template", ["areas", "rows", "columns"]),

      _prefix("auto", ["flow", "rows", "columns"], true),
    ]),
  ],

  placing: [
    paj("content", true),

    paj("items", true),

    _suffix(["row", "column"], "gap"),
  ],

  items: [
    paj("self", true),

    "order",

    _prefix("flex", ["grow", "shrink", "basis"]),

    _prefix("grid", ["area", se("row"), se("column")], true),
  ],

  "box size": [
    "box-sizing",
    "aspect-ratio",
    minMax("inline-size"),
    minMax("block-size"),
    minMax("width"),
    minMax("height"),
  ],

  // prettier-ignore
  "box layout": [
    pos("margin"),
    pos("padding"),
  ],

  border: [
    pos("border").map(b => _prefix(b, ["width", "style", "color"])),

    _prefix("border-image", ["source", "width", "outset", "slice", "repeat"]),

    _suffix(
      _prefix("border", [
        "start-start",
        "start-end",
        "end-end",
        "end-start",

        "top-left",
        "top-right",
        "bottom-right",
        "bottom-left",
      ]),
      "radius",
      true
    ),

    "border-collapse",
  ],

  overflow: [_prefix("overflow", ["x", "y", ib(), "anchor"])],

  text: [
    _prefix(
      "text",
      [
        "align",
        "align-last",

        "transform",

        "shadow",

        "overflow",
        "indent",
        "rendering",

        "wrap",
        "wrap-mode",
        "wrap-style",
      ],
      true
    ),

    "vertical-align",

    "white-space",
    "word-break",

    "letter-spacing",
    "word-spacing",

    _prefix(
      "text",
      [
        _prefix("decoration", ["line", "style", "color", "thickness"]),

        "underline-offset",
        "underline-position",

        "decoration-skip-ink",

        _prefix("emphasis", ["style", "color", "position"]),

        "combine-upright",
        "orientation",
      ],
      true
    ),
  ],

  font: [
    _prefix("font", [
      "family",
      "size",
      "stretch",
      "style",
      "variant",
      "weight",
    ]),
    "line-height",
  ],

  styling: [
    "color",
    "caret-color",

    _prefix("background", [
      "color",
      "image",
      "position",
      "position-x",
      "position-y",
      "size",
      "repeat",
      "attachment",
      "blend-mode",
      "clip",
      "origin",
    ]),

    "opacity",

    "box-shadow",

    _prefix("outline", ["width", "style", "color", "offset"]),
  ],

  filtering: ["filter", "backdrop-filter", "mix-blend-mode"],

  masking: [
    "clip-path",
    "clip-rule",

    _prefix("mask", [
      "image",
      "size",
      "position",
      "origin",
      "clip",
      "composite",
      "mode",
      "repeat",
    ]),
  ],

  object: ["object-fit", "object-position"],

  transforms: [
    "transform",

    "translate",
    "rotate",
    "scale",
    "perspective",
    "perspective-origin",

    _prefix("transform", ["origin", "box", "style"], true),
  ],

  transition: [
    _prefix("transition", [
      "property",
      "duration",
      "delay",
      "timing-function",
      "behavior",
    ]),
  ],

  animation: [
    _prefix("animation", [
      "name",
      "duration",
      "delay",
      "timing-function",
      "iteration-count",
      "direction",
      "fill-mode",
      "play-state",
      "composition",
    ]),
  ],

  scroll: [
    "scroll-behavior",

    pos("scroll-margin"),
    pos("scroll-padding"),

    _prefix("scroll-snap", ["align", "stop", "type"]),

    _prefix("scrollbar", ["gutter", "color", "width"]),
  ],

  cursor: ["cursor"],

  util: ["will-change", "resize"],

  interaction: ["pointer-events", "touch-action", "user-select"],
};

// console.log(
//   JSON.stringify(
//     orderMap,
//     (k, v) => {
//       if (Array.isArray(v)) return v.flat(Infinity);
//       else return v;
//     },
//     2
//   )
// );

// console.log(JSON.stringify(Object.values(orderMap).flat(Infinity).reverse()));

export default {
  plugins: "stylelint-order",
  rules: {
    "order/order": [
      [
        { type: "at-rule", name: "import" },
        // @note https://sass-lang.com/documentation/at-rules/forward/
        { type: "at-rule", name: "forward" },
        { type: "at-rule", name: "use" },
        "dollar-variables",
        "at-variables",
        "custom-properties",
        { type: "at-rule", name: "custom-media" },
        { type: "at-rule", name: "function" },
        { type: "at-rule", name: "mixin" },
        "less-mixins",
        // @note extend class
        { type: "at-rule", name: "extend" },
        // @note include mixin
        { type: "at-rule", name: "include" },
        "declarations",
        { type: "at-rule", name: "media", hasBlock: true },
        {
          type: "rule",
          selector: /^&:[\w-]+/,
          name: "pseudo classes",
        },
        {
          type: "rule",
          selector: /^&::[\w-]+/,
          name: "pseudo elements",
        },
        "rules",
      ],
    ],

    "order/properties-order": [
      [
        ...Object.entries(orderMap).map(
          ([groupName, unflattenedProperties]) => ({
            groupName,
            properties: unflattenedProperties.flat(Infinity),
            emptyLineBefore: "always",
            noEmptyLineBetween: true,
          })
        ),
      ],
      {
        unspecified: "bottomAlphabetical",
        emptyLineBeforeUnspecified: "always",
      },
    ],
  },
};
