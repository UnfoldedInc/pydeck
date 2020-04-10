var customLayerLibrary = (function (core, layers, core$1) {
  'use strict';

  const TILE_CONTENT_STATE = {
    UNLOADED: 0, // Has never been requested
    LOADING: 1, // Is waiting on a pending request
    PROCESSING: 2, // Request received.  Contents are being processed for rendering.  Depending on the content, it might make its own requests for external data.
    READY: 3, // Ready to render.
    EXPIRED: 4, // Is expired and will be unloaded once new content is loaded.
    FAILED: 5 // Request failed.
  };

  // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers_2

  function tile2latLng(x, y, z) {
    const lng = (x / Math.pow(2, z)) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return [lng, lat];
  }

  function tile2boundingBox(x, y, z) {
    const [west, north] = tile2latLng(x, y, z);
    const [east, south] = tile2latLng(x + 1, y + 1, z);
    return {west, north, east, south};
  }

  class Tile2DHeader {
    constructor({x, y, z, getTileData}) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.getTileData = getTileData;

      this.bbox = tile2boundingBox(this.x, this.y, this.z);
      this.isVisible = true;
      this.data = null;
      this.state = TILE_CONTENT_STATE.UNLOADED;
    }

    get isLoaded() {
      return this.state === TILE_CONTENT_STATE.READY;
    }

    isOverlapped(tileIndex) {
      const {x, y, z} = this;
      const m = Math.pow(2, tileIndex.z - z);
      return Math.floor(tileIndex.x / m) === x && Math.floor(tileIndex.y / m) === y;
    }

    async loadContent() {
      if (this.state !== TILE_CONTENT_STATE.UNLOADED) {
        return false;
      }

      try {
        const {x, y, z, bbox} = this;
        this.state = TILE_CONTENT_STATE.LOADING;
        // TODO - use request scheduler
        this.data = await this.getTileData({x, y, z, bbox});
        this.state = TILE_CONTENT_STATE.READY;
        return true;
      } catch (error) {
        this.state = TILE_CONTENT_STATE.FAILED;
        this.data = null;
        throw error;
      }
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */

  function create() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }

    return out;
  }
  /**
   * Scales a vec4 by a scalar number
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec4} out
   */

  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  /**
   * Transforms the vec4 with a mat4.
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec4} out
   */

  function transformMat4(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach = function () {
    var vec = create();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 4;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }

      return a;
    };
  }();

  function createMat4() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  function transformVector(matrix, vector) {
    var result = transformMat4([], vector, matrix);
    scale(result, result, 1 / result[3]);
    return result;
  }

  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */

  function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Multiplies two mat4s
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */

  function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]; // Cache only the current line of the second matrix

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  /**
   * Translate a mat4 by the given vector
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to translate
   * @param {vec3} v vector to translate by
   * @returns {mat4} out
   */

  function translate(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  }
  /**
   * Scales the mat4 by the dimensions in the given vec3 not using vectorization
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to scale
   * @param {vec3} v the vec3 to scale the matrix by
   * @returns {mat4} out
   **/

  function scale$1(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */

  function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat4} a The first matrix.
   * @param {mat4} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function equals(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var a4 = a[4],
        a5 = a[5],
        a6 = a[6],
        a7 = a[7];
    var a8 = a[8],
        a9 = a[9],
        a10 = a[10],
        a11 = a[11];
    var a12 = a[12],
        a13 = a[13],
        a14 = a[14],
        a15 = a[15];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    var b4 = b[4],
        b5 = b[5],
        b6 = b[6],
        b7 = b[7];
    var b8 = b[8],
        b9 = b[9],
        b10 = b[10],
        b11 = b[11];
    var b12 = b[12],
        b13 = b[13],
        b14 = b[14],
        b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
  }

  /**
   * 2 Dimensional Vector
   * @module vec2
   */

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */

  function create$1() {
    var out = new ARRAY_TYPE(2);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }

    return out;
  }
  /**
   * Adds two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  }
  /**
   * Negates the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to negate
   * @returns {vec2} out
   */

  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  }
  /**
   * Performs a linear interpolation between two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec2} out
   */

  function lerp(out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
  }
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$1 = function () {
    var vec = create$1();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 2;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }

      return a;
    };
  }();

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$2() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Negates the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to negate
   * @returns {vec3} out
   */

  function negate$1(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$2 = function () {
    var vec = create$2();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  }();

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || '@math.gl/web-mercator: assertion failed.');
    }
  }

  var PI = Math.PI;
  var PI_4 = PI / 4;
  var DEGREES_TO_RADIANS = PI / 180;
  var RADIANS_TO_DEGREES = 180 / PI;
  var TILE_SIZE = 512;
  var EARTH_CIRCUMFERENCE = 40.03e6;
  var DEFAULT_ALTITUDE = 1.5;
  function zoomToScale(zoom) {
    return Math.pow(2, zoom);
  }
  function lngLatToWorld(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        lng = _ref2[0],
        lat = _ref2[1];

    assert(Number.isFinite(lng));
    assert(Number.isFinite(lat) && lat >= -90 && lat <= 90, 'invalid latitude');
    var lambda2 = lng * DEGREES_TO_RADIANS;
    var phi2 = lat * DEGREES_TO_RADIANS;
    var x = TILE_SIZE * (lambda2 + PI) / (2 * PI);
    var y = TILE_SIZE * (PI + Math.log(Math.tan(PI_4 + phi2 * 0.5))) / (2 * PI);
    return [x, y];
  }
  function worldToLngLat(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        x = _ref4[0],
        y = _ref4[1];

    var lambda2 = x / TILE_SIZE * (2 * PI) - PI;
    var phi2 = 2 * (Math.atan(Math.exp(y / TILE_SIZE * (2 * PI) - PI)) - PI_4);
    return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
  }
  function getDistanceScales(_ref6) {
    var latitude = _ref6.latitude,
        longitude = _ref6.longitude,
        _ref6$highPrecision = _ref6.highPrecision,
        highPrecision = _ref6$highPrecision === void 0 ? false : _ref6$highPrecision;
    assert(Number.isFinite(latitude) && Number.isFinite(longitude));
    var result = {};
    var worldSize = TILE_SIZE;
    var latCosine = Math.cos(latitude * DEGREES_TO_RADIANS);
    var unitsPerDegreeX = worldSize / 360;
    var unitsPerDegreeY = unitsPerDegreeX / latCosine;
    var altUnitsPerMeter = worldSize / EARTH_CIRCUMFERENCE / latCosine;
    result.unitsPerMeter = [altUnitsPerMeter, altUnitsPerMeter, altUnitsPerMeter];
    result.metersPerUnit = [1 / altUnitsPerMeter, 1 / altUnitsPerMeter, 1 / altUnitsPerMeter];
    result.unitsPerDegree = [unitsPerDegreeX, unitsPerDegreeY, altUnitsPerMeter];
    result.degreesPerUnit = [1 / unitsPerDegreeX, 1 / unitsPerDegreeY, 1 / altUnitsPerMeter];

    if (highPrecision) {
      var latCosine2 = DEGREES_TO_RADIANS * Math.tan(latitude * DEGREES_TO_RADIANS) / latCosine;
      var unitsPerDegreeY2 = unitsPerDegreeX * latCosine2 / 2;
      var altUnitsPerDegree2 = worldSize / EARTH_CIRCUMFERENCE * latCosine2;
      var altUnitsPerMeter2 = altUnitsPerDegree2 / unitsPerDegreeY * altUnitsPerMeter;
      result.unitsPerDegree2 = [0, unitsPerDegreeY2, altUnitsPerDegree2];
      result.unitsPerMeter2 = [altUnitsPerMeter2, 0, altUnitsPerMeter2];
    }

    return result;
  }
  function getViewMatrix(_ref7) {
    var height = _ref7.height,
        pitch = _ref7.pitch,
        bearing = _ref7.bearing,
        altitude = _ref7.altitude,
        scale = _ref7.scale,
        _ref7$center = _ref7.center,
        center = _ref7$center === void 0 ? null : _ref7$center;
    var vm = createMat4();
    translate(vm, vm, [0, 0, -altitude]);
    rotateX(vm, vm, -pitch * DEGREES_TO_RADIANS);
    rotateZ(vm, vm, bearing * DEGREES_TO_RADIANS);
    scale /= height;
    scale$1(vm, vm, [scale, scale, scale]);

    if (center) {
      translate(vm, vm, negate$1([], center));
    }

    return vm;
  }
  function getProjectionParameters(_ref8) {
    var width = _ref8.width,
        height = _ref8.height,
        _ref8$altitude = _ref8.altitude,
        altitude = _ref8$altitude === void 0 ? DEFAULT_ALTITUDE : _ref8$altitude,
        _ref8$pitch = _ref8.pitch,
        pitch = _ref8$pitch === void 0 ? 0 : _ref8$pitch,
        _ref8$nearZMultiplier = _ref8.nearZMultiplier,
        nearZMultiplier = _ref8$nearZMultiplier === void 0 ? 1 : _ref8$nearZMultiplier,
        _ref8$farZMultiplier = _ref8.farZMultiplier,
        farZMultiplier = _ref8$farZMultiplier === void 0 ? 1 : _ref8$farZMultiplier;
    var pitchRadians = pitch * DEGREES_TO_RADIANS;
    var halfFov = Math.atan(0.5 / altitude);
    var topHalfSurfaceDistance = Math.sin(halfFov) * altitude / Math.sin(Math.PI / 2 - pitchRadians - halfFov);
    var farZ = Math.cos(Math.PI / 2 - pitchRadians) * topHalfSurfaceDistance + altitude;
    return {
      fov: 2 * halfFov,
      aspect: width / height,
      focalDistance: altitude,
      near: nearZMultiplier,
      far: farZ * farZMultiplier
    };
  }
  function getProjectionMatrix(_ref9) {
    var width = _ref9.width,
        height = _ref9.height,
        pitch = _ref9.pitch,
        altitude = _ref9.altitude,
        nearZMultiplier = _ref9.nearZMultiplier,
        farZMultiplier = _ref9.farZMultiplier;

    var _getProjectionParamet = getProjectionParameters({
      width: width,
      height: height,
      altitude: altitude,
      pitch: pitch,
      nearZMultiplier: nearZMultiplier,
      farZMultiplier: farZMultiplier
    }),
        fov = _getProjectionParamet.fov,
        aspect = _getProjectionParamet.aspect,
        near = _getProjectionParamet.near,
        far = _getProjectionParamet.far;

    var projectionMatrix = perspective([], fov, aspect, near, far);
    return projectionMatrix;
  }
  function worldToPixels(xyz, pixelProjectionMatrix) {
    var _xyz2 = _slicedToArray(xyz, 3),
        x = _xyz2[0],
        y = _xyz2[1],
        _xyz2$ = _xyz2[2],
        z = _xyz2$ === void 0 ? 0 : _xyz2$;

    assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z));
    return transformVector(pixelProjectionMatrix, [x, y, z, 1]);
  }
  function pixelsToWorld(xyz, pixelUnprojectionMatrix) {
    var targetZ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var _xyz3 = _slicedToArray(xyz, 3),
        x = _xyz3[0],
        y = _xyz3[1],
        z = _xyz3[2];

    assert(Number.isFinite(x) && Number.isFinite(y), 'invalid pixel coordinate');

    if (Number.isFinite(z)) {
      var coord = transformVector(pixelUnprojectionMatrix, [x, y, z, 1]);
      return coord;
    }

    var coord0 = transformVector(pixelUnprojectionMatrix, [x, y, 0, 1]);
    var coord1 = transformVector(pixelUnprojectionMatrix, [x, y, 1, 1]);
    var z0 = coord0[2];
    var z1 = coord1[2];
    var t = z0 === z1 ? 0 : ((targetZ || 0) - z0) / (z1 - z0);
    return lerp([], coord0, coord1, t);
  }

  var IDENTITY = createMat4();

  var Viewport = function () {
    function Viewport() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          width = _ref.width,
          height = _ref.height,
          scale = _ref.scale,
          _ref$viewMatrix = _ref.viewMatrix,
          viewMatrix = _ref$viewMatrix === void 0 ? IDENTITY : _ref$viewMatrix,
          _ref$projectionMatrix = _ref.projectionMatrix,
          projectionMatrix = _ref$projectionMatrix === void 0 ? IDENTITY : _ref$projectionMatrix;

      _classCallCheck(this, Viewport);

      this.width = width || 1;
      this.height = height || 1;
      this.scale = scale;
      this.unitsPerMeter = 1;
      this.viewMatrix = viewMatrix;
      this.projectionMatrix = projectionMatrix;
      var vpm = createMat4();
      multiply(vpm, vpm, this.projectionMatrix);
      multiply(vpm, vpm, this.viewMatrix);
      this.viewProjectionMatrix = vpm;
      var m = createMat4();
      scale$1(m, m, [this.width / 2, -this.height / 2, 1]);
      translate(m, m, [1, -1, 0]);
      multiply(m, m, this.viewProjectionMatrix);
      var mInverse = invert(createMat4(), m);

      if (!mInverse) {
        throw new Error('Pixel project matrix not invertible');
      }

      this.pixelProjectionMatrix = m;
      this.pixelUnprojectionMatrix = mInverse;
      this.equals = this.equals.bind(this);
      this.project = this.project.bind(this);
      this.unproject = this.unproject.bind(this);
      this.projectPosition = this.projectPosition.bind(this);
      this.unprojectPosition = this.unprojectPosition.bind(this);
      this.projectFlat = this.projectFlat.bind(this);
      this.unprojectFlat = this.unprojectFlat.bind(this);
    }

    _createClass(Viewport, [{
      key: "equals",
      value: function equals$1(viewport) {
        if (!(viewport instanceof Viewport)) {
          return false;
        }

        return viewport.width === this.width && viewport.height === this.height && equals(viewport.projectionMatrix, this.projectionMatrix) && equals(viewport.viewMatrix, this.viewMatrix);
      }
    }, {
      key: "project",
      value: function project(xyz) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$topLeft = _ref2.topLeft,
            topLeft = _ref2$topLeft === void 0 ? true : _ref2$topLeft;

        var worldPosition = this.projectPosition(xyz);
        var coord = worldToPixels(worldPosition, this.pixelProjectionMatrix);

        var _coord = _slicedToArray(coord, 2),
            x = _coord[0],
            y = _coord[1];

        var y2 = topLeft ? y : this.height - y;
        return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
      }
    }, {
      key: "unproject",
      value: function unproject(xyz) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$topLeft = _ref3.topLeft,
            topLeft = _ref3$topLeft === void 0 ? true : _ref3$topLeft,
            targetZ = _ref3.targetZ;

        var _xyz = _slicedToArray(xyz, 3),
            x = _xyz[0],
            y = _xyz[1],
            z = _xyz[2];

        var y2 = topLeft ? y : this.height - y;
        var targetZWorld = targetZ && targetZ * this.unitsPerMeter;
        var coord = pixelsToWorld([x, y2, z], this.pixelUnprojectionMatrix, targetZWorld);

        var _this$unprojectPositi = this.unprojectPosition(coord),
            _this$unprojectPositi2 = _slicedToArray(_this$unprojectPositi, 3),
            X = _this$unprojectPositi2[0],
            Y = _this$unprojectPositi2[1],
            Z = _this$unprojectPositi2[2];

        if (Number.isFinite(z)) {
          return [X, Y, Z];
        }

        return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
      }
    }, {
      key: "projectPosition",
      value: function projectPosition(xyz) {
        var _this$projectFlat = this.projectFlat(xyz),
            _this$projectFlat2 = _slicedToArray(_this$projectFlat, 2),
            X = _this$projectFlat2[0],
            Y = _this$projectFlat2[1];

        var Z = (xyz[2] || 0) * this.unitsPerMeter;
        return [X, Y, Z];
      }
    }, {
      key: "unprojectPosition",
      value: function unprojectPosition(xyz) {
        var _this$unprojectFlat = this.unprojectFlat(xyz),
            _this$unprojectFlat2 = _slicedToArray(_this$unprojectFlat, 2),
            X = _this$unprojectFlat2[0],
            Y = _this$unprojectFlat2[1];

        var Z = (xyz[2] || 0) / this.unitsPerMeter;
        return [X, Y, Z];
      }
    }, {
      key: "projectFlat",
      value: function projectFlat(xyz) {
        var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
        return xyz;
      }
    }, {
      key: "unprojectFlat",
      value: function unprojectFlat(xyz) {
        var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
        return xyz;
      }
    }]);

    return Viewport;
  }();

  function fitBounds(_ref) {
    var width = _ref.width,
        height = _ref.height,
        bounds = _ref.bounds,
        _ref$minExtent = _ref.minExtent,
        minExtent = _ref$minExtent === void 0 ? 0 : _ref$minExtent,
        _ref$maxZoom = _ref.maxZoom,
        maxZoom = _ref$maxZoom === void 0 ? 24 : _ref$maxZoom,
        _ref$padding = _ref.padding,
        padding = _ref$padding === void 0 ? 0 : _ref$padding,
        _ref$offset = _ref.offset,
        offset = _ref$offset === void 0 ? [0, 0] : _ref$offset;

    var _bounds = _slicedToArray(bounds, 2),
        _bounds$ = _slicedToArray(_bounds[0], 2),
        west = _bounds$[0],
        south = _bounds$[1],
        _bounds$2 = _slicedToArray(_bounds[1], 2),
        east = _bounds$2[0],
        north = _bounds$2[1];

    if (Number.isFinite(padding)) {
      var p = padding;
      padding = {
        top: p,
        bottom: p,
        left: p,
        right: p
      };
    } else {
      assert(Number.isFinite(padding.top) && Number.isFinite(padding.bottom) && Number.isFinite(padding.left) && Number.isFinite(padding.right));
    }

    var viewport = new WebMercatorViewport({
      width: width,
      height: height,
      longitude: 0,
      latitude: 0,
      zoom: 0
    });
    var nw = viewport.project([west, north]);
    var se = viewport.project([east, south]);
    var size = [Math.max(Math.abs(se[0] - nw[0]), minExtent), Math.max(Math.abs(se[1] - nw[1]), minExtent)];
    var targetSize = [width - padding.left - padding.right - Math.abs(offset[0]) * 2, height - padding.top - padding.bottom - Math.abs(offset[1]) * 2];
    assert(targetSize[0] > 0 && targetSize[1] > 0);
    var scaleX = targetSize[0] / size[0];
    var scaleY = targetSize[1] / size[1];
    var offsetX = (padding.right - padding.left) / 2 / scaleX;
    var offsetY = (padding.bottom - padding.top) / 2 / scaleY;
    var center = [(se[0] + nw[0]) / 2 + offsetX, (se[1] + nw[1]) / 2 + offsetY];
    var centerLngLat = viewport.unproject(center);
    var zoom = Math.min(maxZoom, viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY))));
    assert(Number.isFinite(zoom));
    return {
      longitude: centerLngLat[0],
      latitude: centerLngLat[1],
      zoom: zoom
    };
  }

  var WebMercatorViewport = function (_Viewport) {
    _inherits(WebMercatorViewport, _Viewport);

    function WebMercatorViewport() {
      var _this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          width = _ref.width,
          height = _ref.height,
          _ref$latitude = _ref.latitude,
          latitude = _ref$latitude === void 0 ? 0 : _ref$latitude,
          _ref$longitude = _ref.longitude,
          longitude = _ref$longitude === void 0 ? 0 : _ref$longitude,
          _ref$zoom = _ref.zoom,
          zoom = _ref$zoom === void 0 ? 0 : _ref$zoom,
          _ref$pitch = _ref.pitch,
          pitch = _ref$pitch === void 0 ? 0 : _ref$pitch,
          _ref$bearing = _ref.bearing,
          bearing = _ref$bearing === void 0 ? 0 : _ref$bearing,
          _ref$altitude = _ref.altitude,
          altitude = _ref$altitude === void 0 ? 1.5 : _ref$altitude,
          _ref$nearZMultiplier = _ref.nearZMultiplier,
          nearZMultiplier = _ref$nearZMultiplier === void 0 ? 0.02 : _ref$nearZMultiplier,
          _ref$farZMultiplier = _ref.farZMultiplier,
          farZMultiplier = _ref$farZMultiplier === void 0 ? 1.01 : _ref$farZMultiplier;

      _classCallCheck(this, WebMercatorViewport);

      width = width || 1;
      height = height || 1;
      var scale = zoomToScale(zoom);
      altitude = Math.max(0.75, altitude);
      var center = lngLatToWorld([longitude, latitude]);
      center[2] = 0;
      var projectionMatrix = getProjectionMatrix({
        width: width,
        height: height,
        pitch: pitch,
        bearing: bearing,
        altitude: altitude,
        nearZMultiplier: nearZMultiplier,
        farZMultiplier: farZMultiplier
      });
      var viewMatrix = getViewMatrix({
        height: height,
        scale: scale,
        center: center,
        pitch: pitch,
        bearing: bearing,
        altitude: altitude
      });
      _this = _possibleConstructorReturn(this, _getPrototypeOf(WebMercatorViewport).call(this, {
        width: width,
        height: height,
        scale: scale,
        viewMatrix: viewMatrix,
        projectionMatrix: projectionMatrix
      }));
      _this.latitude = latitude;
      _this.longitude = longitude;
      _this.zoom = zoom;
      _this.pitch = pitch;
      _this.bearing = bearing;
      _this.altitude = altitude;
      _this.center = center;
      _this.unitsPerMeter = getDistanceScales(_assertThisInitialized(_this)).unitsPerMeter[2];
      Object.freeze(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(WebMercatorViewport, [{
      key: "projectFlat",
      value: function projectFlat(lngLat) {
        return lngLatToWorld(lngLat);
      }
    }, {
      key: "unprojectFlat",
      value: function unprojectFlat(xy) {
        return worldToLngLat(xy);
      }
    }, {
      key: "getMapCenterByLngLatPosition",
      value: function getMapCenterByLngLatPosition(_ref2) {
        var lngLat = _ref2.lngLat,
            pos = _ref2.pos;
        var fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
        var toLocation = lngLatToWorld(lngLat);
        var translate = add([], toLocation, negate([], fromLocation));
        var newCenter = add([], this.center, translate);
        return worldToLngLat(newCenter, this.scale);
      }
    }, {
      key: "getLocationAtPoint",
      value: function getLocationAtPoint(_ref3) {
        var lngLat = _ref3.lngLat,
            pos = _ref3.pos;
        return this.getMapCenterByLngLatPosition({
          lngLat: lngLat,
          pos: pos
        });
      }
    }, {
      key: "fitBounds",
      value: function fitBounds$1(bounds) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var width = this.width,
            height = this.height;

        var _fitBounds2 = fitBounds(Object.assign({
          width: width,
          height: height,
          bounds: bounds
        }, options)),
            longitude = _fitBounds2.longitude,
            latitude = _fitBounds2.latitude,
            zoom = _fitBounds2.zoom;

        return new WebMercatorViewport({
          width: width,
          height: height,
          longitude: longitude,
          latitude: latitude,
          zoom: zoom
        });
      }
    }]);

    return WebMercatorViewport;
  }(Viewport);

  const TILE_SIZE$1 = 512;

  function getBoundingBox(viewport) {
    const corners = [
      viewport.unproject([0, 0]),
      viewport.unproject([viewport.width, 0]),
      viewport.unproject([0, viewport.height]),
      viewport.unproject([viewport.width, viewport.height])
    ];

    return [
      corners.reduce((minLng, p) => (minLng < p[0] ? minLng : p[0]), 180),
      corners.reduce((minLat, p) => (minLat < p[1] ? minLat : p[1]), 90),
      corners.reduce((maxLng, p) => (maxLng > p[0] ? maxLng : p[0]), -180),
      corners.reduce((maxLat, p) => (maxLat > p[1] ? maxLat : p[1]), -90)
    ];
  }

  function getTileIndex(lngLat, scale) {
    let [x, y] = lngLatToWorld(lngLat);
    x *= scale / TILE_SIZE$1;
    y = (1 - y / TILE_SIZE$1) * scale;
    return [x, y];
  }

  /**
   * Returns all tile indices in the current viewport. If the current zoom level is smaller
   * than minZoom, return an empty array. If the current zoom level is greater than maxZoom,
   * return tiles that are on maxZoom.
   */
  function getTileIndices(viewport, maxZoom, minZoom) {
    const z = Math.floor(viewport.zoom);
    if (minZoom && z < minZoom) {
      return [];
    }

    viewport = new viewport.constructor(
      Object.assign({}, viewport, {
        zoom: z
      })
    );

    const bbox = getBoundingBox(viewport);

    let [minX, minY] = getTileIndex([bbox[0], bbox[3]], viewport.scale);
    let [maxX, maxY] = getTileIndex([bbox[2], bbox[1]], viewport.scale);

    /*
        |  TILE  |  TILE  |  TILE  |
          |(minPixel)           |(maxPixel)
        |(minIndex)                |(maxIndex)
     */
    minX = Math.max(0, Math.floor(minX));
    maxX = Math.min(viewport.scale, Math.ceil(maxX));
    minY = Math.max(0, Math.floor(minY));
    maxY = Math.min(viewport.scale, Math.ceil(maxY));

    const indices = [];

    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        if (maxZoom && z > maxZoom) {
          indices.push(getAdjustedTileIndex({x, y, z}, maxZoom));
        } else {
          indices.push({x, y, z});
        }
      }
    }
    return indices;
  }

  /**
   * Calculates and returns a new tile index {x, y, z}, with z being the given adjustedZ.
   */
  function getAdjustedTileIndex({x, y, z}, adjustedZ) {
    const m = Math.pow(2, z - adjustedZ);
    return {
      x: Math.floor(x / m),
      y: Math.floor(y / m),
      z: adjustedZ
    };
  }

  /**
   * Manages loading and purging of tiles data. This class caches recently visited tiles
   * and only create new tiles if they are not present.
   */
  class Tileset2D {
    /**
     * Takes in a function that returns tile data, a cache size, and a max and a min zoom level.
     * Cache size defaults to 5 * number of tiles in the current viewport
     */
    constructor({maxSize, maxZoom, minZoom, getTileData, onTileLoad, onTileError, onAllTilesLoaded}) {
      this._getTileData = getTileData;
      this.onTileError = onTileError;
      this.onTileLoad = onTileLoad;
      this.onAllTilesLoaded = onAllTilesLoaded;

      // Maps tile id in string {z}-{x}-{y} to a Tile object
      this._cache = new Map();
      this._tiles = [];

      // TODO: Instead of hardcode size, we should calculate how much memory left
      this._maxSize = maxSize;

      if (Number.isFinite(maxZoom)) {
        this._maxZoom = Math.floor(maxZoom);
      }
      if (Number.isFinite(minZoom)) {
        this._minZoom = Math.ceil(minZoom);
      }
    }

    get tiles() {
      return this._tiles;
    }

    /**
     * Clear the current cache
     */
    finalize() {
      this._cache.clear();
    }

    /**
     * Update the cache with the given viewport and triggers callback onUpdate.
     * @param {*} viewport
     * @param {*} onUpdate
     */
    update(viewport) {
      const {_getTileData, _maxSize, _maxZoom, _minZoom} = this;

      this._markOldTiles();

      const tileIndices = getTileIndices(viewport, _maxZoom, _minZoom);
      if (!tileIndices || tileIndices.length === 0) {
        return;
      }

      for (const cachedTile of this._cache.values()) {
        if (tileIndices.some(tileIndex => cachedTile.isOverlapped(tileIndex))) {
          cachedTile.isVisible = true;
        }
      }

      let changed = false;

      for (const tileIndex of tileIndices) {
        const {x, y, z} = tileIndex;
        let tile = this._getTile(x, y, z);
        if (!tile) {
          tile = new Tile2DHeader({
            getTileData: _getTileData,
            x,
            y,
            z
          });

          const tileId = this._getTileId(x, y, z);
          this._cache.set(tileId, tile);
          changed = true;

          this._loadTileContent(tile);
        }
      }

      if (changed) {
        // cache size is either the user defined maxSize or 5 * number of current tiles in the viewport.
        const commonZoomRange = 5;
        this._resizeCache(_maxSize || commonZoomRange * tileIndices.length);
        this._tiles = Array.from(this._cache.values())
          // sort by zoom level so parents tiles don't show up when children tiles are rendered
          .sort((t1, t2) => t1.z - t2.z);
      }
    }

    async _loadTileContent(tile) {
      try {
        await tile.loadContent();
        // console.log('loaded content', tile);
        this.onTileLoad(tile);
        tile.isVisible = true;
      } catch (error) {
        this.onTileError(error);
      }
    }

    /**
     * Clear tiles that are not visible when the cache is full
     */
    _resizeCache(maxSize) {
      if (this._cache.size > maxSize) {
        for (const cachedTile of this._cache) {
          if (this._cache.size <= maxSize) {
            break;
          }
          const tileId = cachedTile[0];
          const tile = cachedTile[1];
          if (!tile.isVisible) {
            this._cache.delete(tileId);
          }
        }
      }
    }

    _markOldTiles() {
      for (const cachedTile of this._cache) {
        cachedTile.isVisible = false;
      }
    }

    _getTile(x, y, z) {
      const tileId = this._getTileId(x, y, z);
      return this._cache.get(tileId);
    }

    _getTileId(x, y, z) {
      return `${z}-${x}-${y}`;
    }
  }

  // TODO

  const defaultProps = {
    renderSubLayers: {type: 'function', value: props => new layers.GeoJsonLayer(props)},
    getTileData: {type: 'function', value: ({x, y, z}) => Promise.resolve(null)},
    onTileLoad: {type: 'function', optional: true, value: () => {}},
    // eslint-disable-next-line
    onTileError: {type: 'function', value: err => console.error(err)},
    onViewportLoad: {type: 'function', optional: true, value: () => {}},
    maxZoom: null,
    minZoom: 0,
    maxCacheSize: null
  };

  class TileLayer extends core.CompositeLayer {
    initializeState() {
      if ('onViewportLoaded' in this.props) {
        core.log.removed('onViewportLoaded', 'onViewportLoad')();
      }

      this.state = {
        tileset: null,
        tiles: [],
        allTilesLoaded: false
      };
    }

    shouldUpdateState({changeFlags}) {
      return changeFlags.somethingChanged;
    }

    updateState({props, oldProps, context, changeFlags}) {
      let {tileset} = this.state;
      if (
        !tileset ||
        (changeFlags.updateTriggersChanged &&
          (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getTileData))
      ) {
        const {getTileData, maxZoom, minZoom, maxCacheSize} = props;
        if (tileset) {
          tileset.finalize();
        }

        tileset = new Tileset2D({
          getTileData,
          maxSize: maxCacheSize,
          maxZoom,
          minZoom,
          onTileLoad: this._onTileLoad.bind(this),
          onTileError: this._onTileError.bind(this)
        });

        this.setState({tileset});
      } else if (changeFlags.updateTriggersChanged) {
        // if any updateTriggersChanged (other than getTileData), delete the layer
        for (const tile of this.state.tileset.tiles) {
          tile.layer = null;
        }
      }

      const {viewport} = context;
      if (changeFlags.viewportChanged && viewport.id !== 'DEFAULT-INITIAL-VIEWPORT') {
        this._updateTileset();
      }
    }

    _onTileLoad(tile) {
      const tilesToDisplay = this.state.tiles;

      this._updateTileset();

      // Callback
      this.props.onTileLoad(tile);

      // Callback to track if layer is completely loaded
      const allTilesLoaded = tilesToDisplay.every(tile => tile.allTilesLoaded);
      if (this.state.allTilesLoaded !== allTilesLoaded) {
        this.setState({allTilesLoaded});
        // this.props.onLayerLoaded(allTilesLoaded);
        if (allTilesLoaded) {
          const {onViewportLoad} = this.props;
          onViewportLoad(tilesToDisplay.filter(tile => tile._data).map(tile => tile._data));
        }
      }
    }

    _onTileError(error) {
      this.props.onTileError(error);
      // errorred tiles should not block rendering, are considered "loaded" with empty data
      this._onTileLoad();
    }

    _updateTileset() {
      const {viewport} = this.context;
      const {tileset} = this.state;
      tileset.update(viewport);

      // The tiles that should be displayed at this zoom level
      const z = this.getZoomLevel();
      const tiles = tileset.tiles.filter(tile => tile.z === z);
      this.setState({
        allTilesLoaded: false,
        tiles
      });

      // console.log(tileset._tiles, tiles, z);

      this.setNeedsUpdate();
      this.setNeedsRedraw();
    }

    getPickingInfo({info, sourceLayer}) {
      info.sourceLayer = sourceLayer;
      info.tile = sourceLayer.props.tile;
      return info;
    }

    getZoomLevel() {
      const {viewport} = this.context;
      const z = Math.floor(viewport.zoom);
      const {maxZoom, minZoom} = this.props;
      if (Number.isFinite(maxZoom) && z > maxZoom) {
        return Math.floor(maxZoom);
      } else if (Number.isFinite(minZoom) && z < minZoom) {
        return Math.ceil(minZoom);
      }
      return z;
    }

    renderLayers() {
      const {renderSubLayers, visible} = this.props;
      const z = this.getZoomLevel();

      const layers = [];
      for (const tile of this.state.tileset.tiles) {
        if (tile.isLoaded) {
          // For a tile to be visible:
          // - parent layer must be visible
          // - tile must be visible in the current viewport
          // - if all tiles are loaded, only display the tiles from the current z level
          const isVisible = visible && tile.isVisible && (!this.state.isLoaded || tile.z === z);
          // cache the rendered layer in the tile
          // TODO - layers never update?
          if (!tile.layer) {
            const subLayers = renderSubLayers(
              Object.assign({}, this.props, {
                id: `${this.id}-${tile.x}-${tile.y}-${tile.z}`,
                data: tile.data,
                visible: isVisible,
                tile
              })
            );
            // eslint-disable-next-line max-depth
            if (subLayers) {
              tile.layer = Array.isArray(subLayers) ? subLayers : [subLayers];
            }
          } else if (tile.layer.some(layer => layer.props.visible !== isVisible)) {
            tile.layer = tile.layer.map(layer => layer.clone({visible: isVisible}));
          }
        }
        layers.push(tile.layer);
      }
      return layers;
    }

    /* Original layer code
    renderLayers() {
      const {renderSubLayers, visible} = this.props;
      const z = this.getZoomLevel();

      console.log('renderlayers', tileset._tiles, tiles, z);
      return this.state.tileset.tiles.map(tile => {
        // For a tile to be visible:
        // - parent layer must be visible
        // - tile must be visible in the current viewport
        // - if all tiles are loaded, only display the tiles from the current z level
        const isVisible = visible && tile.isVisible && (!this.state.allTilesLoaded || tile.z === z);
        // cache the rendered layer in the tile
        if (!tile.layer) {
          tile.layer = renderSubLayers(
            Object.assign({}, this.props, {
              id: `${this.id}-${tile.x}-${tile.y}-${tile.z}`,
              data: tile.data,
              visible: isVisible,
              tile
            })
          );
        } else if (tile.layer.props.visible !== isVisible) {
          tile.layer = tile.layer.clone({visible: isVisible});
        }
        return tile.layer;
      });
    }
    */
  }

  TileLayer.layerName = 'TileLayer';
  TileLayer.defaultProps = defaultProps;

  class EnhancedTileLayer extends TileLayer {
    renderLayers() {
      const {renderSubLayers, visible} = this.props;
      const z = this.getZoomLevel();

      const layers = [];
      for (const tile of this.state.tileset.tiles) {
        if (tile.isLoaded) {
          // For a tile to be visible:
          // - parent layer must be visible
          // - tile must be visible in the current viewport
          // - if all tiles are loaded, only display the tiles from the current z level
          const isVisible = visible && tile.isVisible && (!this.state.isLoaded || tile.z === z);
          // cache the rendered layer in the tile
          if (!tile.layer) {
            const subLayers = renderSubLayers(
              Object.assign({}, this.props, {
                id: `${this.id}-${tile.x}-${tile.y}-${tile.z}`,
                data: tile.data,
                visible: isVisible,
                tile
              })
            );
            // eslint-disable-next-line max-depth
            if (subLayers) {
              tile.layer = Array.isArray(subLayers) ? subLayers : [subLayers];
            }
          } else if (tile.layer.some(layer => layer.props.visible !== isVisible)) {
            tile.layer = tile.layer.map(layer => layer.clone({visible: isVisible}));
          }
        }
        layers.push(tile.layer);
      }
      return layers;
    }
  }

  // GL constants, copied from Mozilla documentation
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

  // Standard WebGL 1 constants
  // These constants are defined on the WebGLRenderingContext interface.

  /* eslint-disable key-spacing, max-len, no-inline-comments, camelcase */
  // eslint-disable-next-line
  var src = {
    // Clearing buffers
    // Constants passed to clear() to clear buffer masks.

    DEPTH_BUFFER_BIT: 0x00000100,
    STENCIL_BUFFER_BIT: 0x00000400,
    COLOR_BUFFER_BIT: 0x00004000,

    // Rendering primitives
    // Constants passed to drawElements() or drawArrays() to specify what kind of primitive to render.

    POINTS: 0x0000,
    LINES: 0x0001,
    LINE_LOOP: 0x0002,
    LINE_STRIP: 0x0003,
    TRIANGLES: 0x0004,
    TRIANGLE_STRIP: 0x0005,
    TRIANGLE_FAN: 0x0006,

    // Blending modes
    // Constants passed to blendFunc() or blendFuncSeparate() to specify the blending mode (for both, RBG and alpha, or separately).

    ZERO: 0,
    ONE: 1,
    SRC_COLOR: 0x0300,
    ONE_MINUS_SRC_COLOR: 0x0301,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    DST_ALPHA: 0x0304,
    ONE_MINUS_DST_ALPHA: 0x0305,
    DST_COLOR: 0x0306,
    ONE_MINUS_DST_COLOR: 0x0307,
    SRC_ALPHA_SATURATE: 0x0308,
    CONSTANT_COLOR: 0x8001,
    ONE_MINUS_CONSTANT_COLOR: 0x8002,
    CONSTANT_ALPHA: 0x8003,
    ONE_MINUS_CONSTANT_ALPHA: 0x8004,

    // Blending equations
    // Constants passed to blendEquation() or blendEquationSeparate() to control
    // how the blending is calculated (for both, RBG and alpha, or separately).

    FUNC_ADD: 0x8006,
    FUNC_SUBTRACT: 0x800a,
    FUNC_REVERSE_SUBTRACT: 0x800b,

    // Getting GL parameter information
    // Constants passed to getParameter() to specify what information to return.

    BLEND_EQUATION: 0x8009,
    BLEND_EQUATION_RGB: 0x8009,
    BLEND_EQUATION_ALPHA: 0x883d,
    BLEND_DST_RGB: 0x80c8,
    BLEND_SRC_RGB: 0x80c9,
    BLEND_DST_ALPHA: 0x80ca,
    BLEND_SRC_ALPHA: 0x80cb,
    BLEND_COLOR: 0x8005,
    ARRAY_BUFFER_BINDING: 0x8894,
    ELEMENT_ARRAY_BUFFER_BINDING: 0x8895,
    LINE_WIDTH: 0x0b21,
    ALIASED_POINT_SIZE_RANGE: 0x846d,
    ALIASED_LINE_WIDTH_RANGE: 0x846e,
    CULL_FACE_MODE: 0x0b45,
    FRONT_FACE: 0x0b46,
    DEPTH_RANGE: 0x0b70,
    DEPTH_WRITEMASK: 0x0b72,
    DEPTH_CLEAR_VALUE: 0x0b73,
    DEPTH_FUNC: 0x0b74,
    STENCIL_CLEAR_VALUE: 0x0b91,
    STENCIL_FUNC: 0x0b92,
    STENCIL_FAIL: 0x0b94,
    STENCIL_PASS_DEPTH_FAIL: 0x0b95,
    STENCIL_PASS_DEPTH_PASS: 0x0b96,
    STENCIL_REF: 0x0b97,
    STENCIL_VALUE_MASK: 0x0b93,
    STENCIL_WRITEMASK: 0x0b98,
    STENCIL_BACK_FUNC: 0x8800,
    STENCIL_BACK_FAIL: 0x8801,
    STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802,
    STENCIL_BACK_PASS_DEPTH_PASS: 0x8803,
    STENCIL_BACK_REF: 0x8ca3,
    STENCIL_BACK_VALUE_MASK: 0x8ca4,
    STENCIL_BACK_WRITEMASK: 0x8ca5,
    VIEWPORT: 0x0ba2,
    SCISSOR_BOX: 0x0c10,
    COLOR_CLEAR_VALUE: 0x0c22,
    COLOR_WRITEMASK: 0x0c23,
    UNPACK_ALIGNMENT: 0x0cf5,
    PACK_ALIGNMENT: 0x0d05,
    MAX_TEXTURE_SIZE: 0x0d33,
    MAX_VIEWPORT_DIMS: 0x0d3a,
    SUBPIXEL_BITS: 0x0d50,
    RED_BITS: 0x0d52,
    GREEN_BITS: 0x0d53,
    BLUE_BITS: 0x0d54,
    ALPHA_BITS: 0x0d55,
    DEPTH_BITS: 0x0d56,
    STENCIL_BITS: 0x0d57,
    POLYGON_OFFSET_UNITS: 0x2a00,
    POLYGON_OFFSET_FACTOR: 0x8038,
    TEXTURE_BINDING_2D: 0x8069,
    SAMPLE_BUFFERS: 0x80a8,
    SAMPLES: 0x80a9,
    SAMPLE_COVERAGE_VALUE: 0x80aa,
    SAMPLE_COVERAGE_INVERT: 0x80ab,
    COMPRESSED_TEXTURE_FORMATS: 0x86a3,
    VENDOR: 0x1f00,
    RENDERER: 0x1f01,
    VERSION: 0x1f02,
    IMPLEMENTATION_COLOR_READ_TYPE: 0x8b9a,
    IMPLEMENTATION_COLOR_READ_FORMAT: 0x8b9b,
    BROWSER_DEFAULT_WEBGL: 0x9244,

    // Buffers
    // Constants passed to bufferData(), bufferSubData(), bindBuffer(), or
    // getBufferParameter().

    STATIC_DRAW: 0x88e4,
    STREAM_DRAW: 0x88e0,
    DYNAMIC_DRAW: 0x88e8,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    BUFFER_SIZE: 0x8764,
    BUFFER_USAGE: 0x8765,

    // Vertex attributes
    // Constants passed to getVertexAttrib().

    CURRENT_VERTEX_ATTRIB: 0x8626,
    VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622,
    VERTEX_ATTRIB_ARRAY_SIZE: 0x8623,
    VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624,
    VERTEX_ATTRIB_ARRAY_TYPE: 0x8625,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886a,
    VERTEX_ATTRIB_ARRAY_POINTER: 0x8645,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889f,

    // Culling
    // Constants passed to cullFace().

    CULL_FACE: 0x0b44,
    FRONT: 0x0404,
    BACK: 0x0405,
    FRONT_AND_BACK: 0x0408,

    // Enabling and disabling
    // Constants passed to enable() or disable().

    BLEND: 0x0be2,
    DEPTH_TEST: 0x0b71,
    DITHER: 0x0bd0,
    POLYGON_OFFSET_FILL: 0x8037,
    SAMPLE_ALPHA_TO_COVERAGE: 0x809e,
    SAMPLE_COVERAGE: 0x80a0,
    SCISSOR_TEST: 0x0c11,
    STENCIL_TEST: 0x0b90,

    // Errors
    // Constants returned from getError().

    NO_ERROR: 0,
    INVALID_ENUM: 0x0500,
    INVALID_VALUE: 0x0501,
    INVALID_OPERATION: 0x0502,
    OUT_OF_MEMORY: 0x0505,
    CONTEXT_LOST_WEBGL: 0x9242,

    // Front face directions
    // Constants passed to frontFace().

    CW: 0x0900,
    CCW: 0x0901,

    // Hints
    // Constants passed to hint()

    DONT_CARE: 0x1100,
    FASTEST: 0x1101,
    NICEST: 0x1102,
    GENERATE_MIPMAP_HINT: 0x8192,

    // Data types

    BYTE: 0x1400,
    UNSIGNED_BYTE: 0x1401,
    SHORT: 0x1402,
    UNSIGNED_SHORT: 0x1403,
    INT: 0x1404,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,
    DOUBLE: 0x140a,

    // Pixel formats

    DEPTH_COMPONENT: 0x1902,
    ALPHA: 0x1906,
    RGB: 0x1907,
    RGBA: 0x1908,
    LUMINANCE: 0x1909,
    LUMINANCE_ALPHA: 0x190a,

    // Pixel types

    // UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,

    // Shaders
    // Constants passed to createShader() or getShaderParameter()

    FRAGMENT_SHADER: 0x8b30,
    VERTEX_SHADER: 0x8b31,
    COMPILE_STATUS: 0x8b81,
    DELETE_STATUS: 0x8b80,
    LINK_STATUS: 0x8b82,
    VALIDATE_STATUS: 0x8b83,
    ATTACHED_SHADERS: 0x8b85,
    ACTIVE_ATTRIBUTES: 0x8b89,
    ACTIVE_UNIFORMS: 0x8b86,
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb,
    MAX_VARYING_VECTORS: 0x8dfc,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872,
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    SHADER_TYPE: 0x8b4f,
    SHADING_LANGUAGE_VERSION: 0x8b8c,
    CURRENT_PROGRAM: 0x8b8d,

    // Depth or stencil tests
    // Constants passed to depthFunc() or stencilFunc().

    NEVER: 0x0200,
    ALWAYS: 0x0207,
    LESS: 0x0201,
    EQUAL: 0x0202,
    LEQUAL: 0x0203,
    GREATER: 0x0204,
    GEQUAL: 0x0206,
    NOTEQUAL: 0x0205,

    // Stencil actions
    // Constants passed to stencilOp().

    KEEP: 0x1e00,
    REPLACE: 0x1e01,
    INCR: 0x1e02,
    DECR: 0x1e03,
    INVERT: 0x150a,
    INCR_WRAP: 0x8507,
    DECR_WRAP: 0x8508,

    // Textures
    // Constants passed to texParameteri(),
    // texParameterf(), bindTexture(), texImage2D(), and others.

    NEAREST: 0x2600,
    LINEAR: 0x2601,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TEXTURE_2D: 0x0de1,
    TEXTURE: 0x1702,
    TEXTURE_CUBE_MAP: 0x8513,
    TEXTURE_BINDING_CUBE_MAP: 0x8514,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851a,
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c,
    // TEXTURE0 - 31 0x84C0 - 0x84DF A texture unit.
    TEXTURE0: 0x84c0,
    ACTIVE_TEXTURE: 0x84e0,
    REPEAT: 0x2901,
    CLAMP_TO_EDGE: 0x812f,
    MIRRORED_REPEAT: 0x8370,

    // Emulation
    TEXTURE_WIDTH: 0x1000,
    TEXTURE_HEIGHT: 0x1001,

    // Uniform types

    FLOAT_VEC2: 0x8b50,
    FLOAT_VEC3: 0x8b51,
    FLOAT_VEC4: 0x8b52,
    INT_VEC2: 0x8b53,
    INT_VEC3: 0x8b54,
    INT_VEC4: 0x8b55,
    BOOL: 0x8b56,
    BOOL_VEC2: 0x8b57,
    BOOL_VEC3: 0x8b58,
    BOOL_VEC4: 0x8b59,
    FLOAT_MAT2: 0x8b5a,
    FLOAT_MAT3: 0x8b5b,
    FLOAT_MAT4: 0x8b5c,
    SAMPLER_2D: 0x8b5e,
    SAMPLER_CUBE: 0x8b60,

    // Shader precision-specified types

    LOW_FLOAT: 0x8df0,
    MEDIUM_FLOAT: 0x8df1,
    HIGH_FLOAT: 0x8df2,
    LOW_INT: 0x8df3,
    MEDIUM_INT: 0x8df4,
    HIGH_INT: 0x8df5,

    // Framebuffers and renderbuffers

    FRAMEBUFFER: 0x8d40,
    RENDERBUFFER: 0x8d41,
    RGBA4: 0x8056,
    RGB5_A1: 0x8057,
    RGB565: 0x8d62,
    DEPTH_COMPONENT16: 0x81a5,
    STENCIL_INDEX: 0x1901,
    STENCIL_INDEX8: 0x8d48,
    DEPTH_STENCIL: 0x84f9,
    RENDERBUFFER_WIDTH: 0x8d42,
    RENDERBUFFER_HEIGHT: 0x8d43,
    RENDERBUFFER_INTERNAL_FORMAT: 0x8d44,
    RENDERBUFFER_RED_SIZE: 0x8d50,
    RENDERBUFFER_GREEN_SIZE: 0x8d51,
    RENDERBUFFER_BLUE_SIZE: 0x8d52,
    RENDERBUFFER_ALPHA_SIZE: 0x8d53,
    RENDERBUFFER_DEPTH_SIZE: 0x8d54,
    RENDERBUFFER_STENCIL_SIZE: 0x8d55,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8cd0,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8cd1,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8cd2,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8cd3,
    COLOR_ATTACHMENT0: 0x8ce0,
    DEPTH_ATTACHMENT: 0x8d00,
    STENCIL_ATTACHMENT: 0x8d20,
    DEPTH_STENCIL_ATTACHMENT: 0x821a,
    NONE: 0,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9,
    FRAMEBUFFER_UNSUPPORTED: 0x8cdd,
    FRAMEBUFFER_BINDING: 0x8ca6,
    RENDERBUFFER_BINDING: 0x8ca7,
    READ_FRAMEBUFFER: 0x8ca8,
    DRAW_FRAMEBUFFER: 0x8ca9,
    MAX_RENDERBUFFER_SIZE: 0x84e8,
    INVALID_FRAMEBUFFER_OPERATION: 0x0506,

    // Pixel storage modes
    // Constants passed to pixelStorei().

    UNPACK_FLIP_Y_WEBGL: 0x9240,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,

    // /////////////////////////////////////////////////////
    // Additional constants defined WebGL 2
    // These constants are defined on the WebGL2RenderingContext interface.
    // All WebGL 1 constants are also available in a WebGL 2 context.
    // /////////////////////////////////////////////////////

    // Getting GL parameter information
    // Constants passed to getParameter()
    // to specify what information to return.

    READ_BUFFER: 0x0c02,
    UNPACK_ROW_LENGTH: 0x0cf2,
    UNPACK_SKIP_ROWS: 0x0cf3,
    UNPACK_SKIP_PIXELS: 0x0cf4,
    PACK_ROW_LENGTH: 0x0d02,
    PACK_SKIP_ROWS: 0x0d03,
    PACK_SKIP_PIXELS: 0x0d04,
    TEXTURE_BINDING_3D: 0x806a,
    UNPACK_SKIP_IMAGES: 0x806d,
    UNPACK_IMAGE_HEIGHT: 0x806e,
    MAX_3D_TEXTURE_SIZE: 0x8073,
    MAX_ELEMENTS_VERTICES: 0x80e8,
    MAX_ELEMENTS_INDICES: 0x80e9,
    MAX_TEXTURE_LOD_BIAS: 0x84fd,
    MAX_FRAGMENT_UNIFORM_COMPONENTS: 0x8b49,
    MAX_VERTEX_UNIFORM_COMPONENTS: 0x8b4a,
    MAX_ARRAY_TEXTURE_LAYERS: 0x88ff,
    MIN_PROGRAM_TEXEL_OFFSET: 0x8904,
    MAX_PROGRAM_TEXEL_OFFSET: 0x8905,
    MAX_VARYING_COMPONENTS: 0x8b4b,
    FRAGMENT_SHADER_DERIVATIVE_HINT: 0x8b8b,
    RASTERIZER_DISCARD: 0x8c89,
    VERTEX_ARRAY_BINDING: 0x85b5,
    MAX_VERTEX_OUTPUT_COMPONENTS: 0x9122,
    MAX_FRAGMENT_INPUT_COMPONENTS: 0x9125,
    MAX_SERVER_WAIT_TIMEOUT: 0x9111,
    MAX_ELEMENT_INDEX: 0x8d6b,

    // Textures
    // Constants passed to texParameteri(),
    // texParameterf(), bindTexture(), texImage2D(), and others.

    RED: 0x1903,
    RGB8: 0x8051,
    RGBA8: 0x8058,
    RGB10_A2: 0x8059,
    TEXTURE_3D: 0x806f,
    TEXTURE_WRAP_R: 0x8072,
    TEXTURE_MIN_LOD: 0x813a,
    TEXTURE_MAX_LOD: 0x813b,
    TEXTURE_BASE_LEVEL: 0x813c,
    TEXTURE_MAX_LEVEL: 0x813d,
    TEXTURE_COMPARE_MODE: 0x884c,
    TEXTURE_COMPARE_FUNC: 0x884d,
    SRGB: 0x8c40,
    SRGB8: 0x8c41,
    SRGB8_ALPHA8: 0x8c43,
    COMPARE_REF_TO_TEXTURE: 0x884e,
    RGBA32F: 0x8814,
    RGB32F: 0x8815,
    RGBA16F: 0x881a,
    RGB16F: 0x881b,
    TEXTURE_2D_ARRAY: 0x8c1a,
    TEXTURE_BINDING_2D_ARRAY: 0x8c1d,
    R11F_G11F_B10F: 0x8c3a,
    RGB9_E5: 0x8c3d,
    RGBA32UI: 0x8d70,
    RGB32UI: 0x8d71,
    RGBA16UI: 0x8d76,
    RGB16UI: 0x8d77,
    RGBA8UI: 0x8d7c,
    RGB8UI: 0x8d7d,
    RGBA32I: 0x8d82,
    RGB32I: 0x8d83,
    RGBA16I: 0x8d88,
    RGB16I: 0x8d89,
    RGBA8I: 0x8d8e,
    RGB8I: 0x8d8f,
    RED_INTEGER: 0x8d94,
    RGB_INTEGER: 0x8d98,
    RGBA_INTEGER: 0x8d99,
    R8: 0x8229,
    RG8: 0x822b,
    R16F: 0x822d,
    R32F: 0x822e,
    RG16F: 0x822f,
    RG32F: 0x8230,
    R8I: 0x8231,
    R8UI: 0x8232,
    R16I: 0x8233,
    R16UI: 0x8234,
    R32I: 0x8235,
    R32UI: 0x8236,
    RG8I: 0x8237,
    RG8UI: 0x8238,
    RG16I: 0x8239,
    RG16UI: 0x823a,
    RG32I: 0x823b,
    RG32UI: 0x823c,
    R8_SNORM: 0x8f94,
    RG8_SNORM: 0x8f95,
    RGB8_SNORM: 0x8f96,
    RGBA8_SNORM: 0x8f97,
    RGB10_A2UI: 0x906f,

    /* covered by extension
    COMPRESSED_R11_EAC : 0x9270,
    COMPRESSED_SIGNED_R11_EAC: 0x9271,
    COMPRESSED_RG11_EAC: 0x9272,
    COMPRESSED_SIGNED_RG11_EAC : 0x9273,
    COMPRESSED_RGB8_ETC2 : 0x9274,
    COMPRESSED_SRGB8_ETC2: 0x9275,
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 : 0x9276,
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC : 0x9277,
    COMPRESSED_RGBA8_ETC2_EAC: 0x9278,
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : 0x9279,
    */
    TEXTURE_IMMUTABLE_FORMAT: 0x912f,
    TEXTURE_IMMUTABLE_LEVELS: 0x82df,

    // Pixel types

    UNSIGNED_INT_2_10_10_10_REV: 0x8368,
    UNSIGNED_INT_10F_11F_11F_REV: 0x8c3b,
    UNSIGNED_INT_5_9_9_9_REV: 0x8c3e,
    FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8dad,
    UNSIGNED_INT_24_8: 0x84fa,
    HALF_FLOAT: 0x140b,
    RG: 0x8227,
    RG_INTEGER: 0x8228,
    INT_2_10_10_10_REV: 0x8d9f,

    // Queries

    CURRENT_QUERY: 0x8865,
    QUERY_RESULT: 0x8866,
    QUERY_RESULT_AVAILABLE: 0x8867,
    ANY_SAMPLES_PASSED: 0x8c2f,
    ANY_SAMPLES_PASSED_CONSERVATIVE: 0x8d6a,

    // Draw buffers

    MAX_DRAW_BUFFERS: 0x8824,
    DRAW_BUFFER0: 0x8825,
    DRAW_BUFFER1: 0x8826,
    DRAW_BUFFER2: 0x8827,
    DRAW_BUFFER3: 0x8828,
    DRAW_BUFFER4: 0x8829,
    DRAW_BUFFER5: 0x882a,
    DRAW_BUFFER6: 0x882b,
    DRAW_BUFFER7: 0x882c,
    DRAW_BUFFER8: 0x882d,
    DRAW_BUFFER9: 0x882e,
    DRAW_BUFFER10: 0x882f,
    DRAW_BUFFER11: 0x8830,
    DRAW_BUFFER12: 0x8831,
    DRAW_BUFFER13: 0x8832,
    DRAW_BUFFER14: 0x8833,
    DRAW_BUFFER15: 0x8834,
    MAX_COLOR_ATTACHMENTS: 0x8cdf,
    COLOR_ATTACHMENT1: 0x8ce1,
    COLOR_ATTACHMENT2: 0x8ce2,
    COLOR_ATTACHMENT3: 0x8ce3,
    COLOR_ATTACHMENT4: 0x8ce4,
    COLOR_ATTACHMENT5: 0x8ce5,
    COLOR_ATTACHMENT6: 0x8ce6,
    COLOR_ATTACHMENT7: 0x8ce7,
    COLOR_ATTACHMENT8: 0x8ce8,
    COLOR_ATTACHMENT9: 0x8ce9,
    COLOR_ATTACHMENT10: 0x8cea,
    COLOR_ATTACHMENT11: 0x8ceb,
    COLOR_ATTACHMENT12: 0x8cec,
    COLOR_ATTACHMENT13: 0x8ced,
    COLOR_ATTACHMENT14: 0x8cee,
    COLOR_ATTACHMENT15: 0x8cef,

    // Samplers

    SAMPLER_3D: 0x8b5f,
    SAMPLER_2D_SHADOW: 0x8b62,
    SAMPLER_2D_ARRAY: 0x8dc1,
    SAMPLER_2D_ARRAY_SHADOW: 0x8dc4,
    SAMPLER_CUBE_SHADOW: 0x8dc5,
    INT_SAMPLER_2D: 0x8dca,
    INT_SAMPLER_3D: 0x8dcb,
    INT_SAMPLER_CUBE: 0x8dcc,
    INT_SAMPLER_2D_ARRAY: 0x8dcf,
    UNSIGNED_INT_SAMPLER_2D: 0x8dd2,
    UNSIGNED_INT_SAMPLER_3D: 0x8dd3,
    UNSIGNED_INT_SAMPLER_CUBE: 0x8dd4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8dd7,
    MAX_SAMPLES: 0x8d57,
    SAMPLER_BINDING: 0x8919,

    // Buffers

    PIXEL_PACK_BUFFER: 0x88eb,
    PIXEL_UNPACK_BUFFER: 0x88ec,
    PIXEL_PACK_BUFFER_BINDING: 0x88ed,
    PIXEL_UNPACK_BUFFER_BINDING: 0x88ef,
    COPY_READ_BUFFER: 0x8f36,
    COPY_WRITE_BUFFER: 0x8f37,
    COPY_READ_BUFFER_BINDING: 0x8f36,
    COPY_WRITE_BUFFER_BINDING: 0x8f37,

    // Data types

    FLOAT_MAT2x3: 0x8b65,
    FLOAT_MAT2x4: 0x8b66,
    FLOAT_MAT3x2: 0x8b67,
    FLOAT_MAT3x4: 0x8b68,
    FLOAT_MAT4x2: 0x8b69,
    FLOAT_MAT4x3: 0x8b6a,
    UNSIGNED_INT_VEC2: 0x8dc6,
    UNSIGNED_INT_VEC3: 0x8dc7,
    UNSIGNED_INT_VEC4: 0x8dc8,
    UNSIGNED_NORMALIZED: 0x8c17,
    SIGNED_NORMALIZED: 0x8f9c,

    // Vertex attributes

    VERTEX_ATTRIB_ARRAY_INTEGER: 0x88fd,
    VERTEX_ATTRIB_ARRAY_DIVISOR: 0x88fe,

    // Transform feedback

    TRANSFORM_FEEDBACK_BUFFER_MODE: 0x8c7f,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 0x8c80,
    TRANSFORM_FEEDBACK_VARYINGS: 0x8c83,
    TRANSFORM_FEEDBACK_BUFFER_START: 0x8c84,
    TRANSFORM_FEEDBACK_BUFFER_SIZE: 0x8c85,
    TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 0x8c88,
    MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 0x8c8a,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 0x8c8b,
    INTERLEAVED_ATTRIBS: 0x8c8c,
    SEPARATE_ATTRIBS: 0x8c8d,
    TRANSFORM_FEEDBACK_BUFFER: 0x8c8e,
    TRANSFORM_FEEDBACK_BUFFER_BINDING: 0x8c8f,
    TRANSFORM_FEEDBACK: 0x8e22,
    TRANSFORM_FEEDBACK_PAUSED: 0x8e23,
    TRANSFORM_FEEDBACK_ACTIVE: 0x8e24,
    TRANSFORM_FEEDBACK_BINDING: 0x8e25,

    // Framebuffers and renderbuffers

    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 0x8210,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 0x8211,
    FRAMEBUFFER_ATTACHMENT_RED_SIZE: 0x8212,
    FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 0x8213,
    FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 0x8214,
    FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 0x8215,
    FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 0x8216,
    FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 0x8217,
    FRAMEBUFFER_DEFAULT: 0x8218,
    // DEPTH_STENCIL_ATTACHMENT : 0x821A,
    // DEPTH_STENCIL: 0x84F9,
    DEPTH24_STENCIL8: 0x88f0,
    DRAW_FRAMEBUFFER_BINDING: 0x8ca6,
    READ_FRAMEBUFFER_BINDING: 0x8caa,
    RENDERBUFFER_SAMPLES: 0x8cab,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 0x8cd4,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8d56,

    // Uniforms

    UNIFORM_BUFFER: 0x8a11,
    UNIFORM_BUFFER_BINDING: 0x8a28,
    UNIFORM_BUFFER_START: 0x8a29,
    UNIFORM_BUFFER_SIZE: 0x8a2a,
    MAX_VERTEX_UNIFORM_BLOCKS: 0x8a2b,
    MAX_FRAGMENT_UNIFORM_BLOCKS: 0x8a2d,
    MAX_COMBINED_UNIFORM_BLOCKS: 0x8a2e,
    MAX_UNIFORM_BUFFER_BINDINGS: 0x8a2f,
    MAX_UNIFORM_BLOCK_SIZE: 0x8a30,
    MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 0x8a31,
    MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 0x8a33,
    UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8a34,
    ACTIVE_UNIFORM_BLOCKS: 0x8a36,
    UNIFORM_TYPE: 0x8a37,
    UNIFORM_SIZE: 0x8a38,
    UNIFORM_BLOCK_INDEX: 0x8a3a,
    UNIFORM_OFFSET: 0x8a3b,
    UNIFORM_ARRAY_STRIDE: 0x8a3c,
    UNIFORM_MATRIX_STRIDE: 0x8a3d,
    UNIFORM_IS_ROW_MAJOR: 0x8a3e,
    UNIFORM_BLOCK_BINDING: 0x8a3f,
    UNIFORM_BLOCK_DATA_SIZE: 0x8a40,
    UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8a42,
    UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8a43,
    UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 0x8a44,
    UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 0x8a46,

    // Sync objects

    OBJECT_TYPE: 0x9112,
    SYNC_CONDITION: 0x9113,
    SYNC_STATUS: 0x9114,
    SYNC_FLAGS: 0x9115,
    SYNC_FENCE: 0x9116,
    SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
    UNSIGNALED: 0x9118,
    SIGNALED: 0x9119,
    ALREADY_SIGNALED: 0x911a,
    TIMEOUT_EXPIRED: 0x911b,
    CONDITION_SATISFIED: 0x911c,
    WAIT_FAILED: 0x911d,
    SYNC_FLUSH_COMMANDS_BIT: 0x00000001,

    // Miscellaneous constants

    COLOR: 0x1800,
    DEPTH: 0x1801,
    STENCIL: 0x1802,
    MIN: 0x8007,
    MAX: 0x8008,
    DEPTH_COMPONENT24: 0x81a6,
    STREAM_READ: 0x88e1,
    STREAM_COPY: 0x88e2,
    STATIC_READ: 0x88e5,
    STATIC_COPY: 0x88e6,
    DYNAMIC_READ: 0x88e9,
    DYNAMIC_COPY: 0x88ea,
    DEPTH_COMPONENT32F: 0x8cac,
    DEPTH32F_STENCIL8: 0x8cad,
    INVALID_INDEX: 0xffffffff,
    TIMEOUT_IGNORED: -1,
    MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 0x9247,

    // Constants defined in WebGL extensions

    // ANGLE_instanced_arrays

    VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88fe,

    // WEBGL_debug_renderer_info

    UNMASKED_VENDOR_WEBGL: 0x9245,
    UNMASKED_RENDERER_WEBGL: 0x9246,

    // EXT_texture_filter_anisotropic

    MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff,
    TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe,

    // WEBGL_compressed_texture_s3tc

    COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83f0,
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83f1,
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83f2,
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83f3,

    // WEBGL_compressed_texture_es3

    COMPRESSED_R11_EAC: 0x9270,
    COMPRESSED_SIGNED_R11_EAC: 0x9271,
    COMPRESSED_RG11_EAC: 0x9272,
    COMPRESSED_SIGNED_RG11_EAC: 0x9273,
    COMPRESSED_RGB8_ETC2: 0x9274,
    COMPRESSED_RGBA8_ETC2_EAC: 0x9275,
    COMPRESSED_SRGB8_ETC2: 0x9276,
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9277,
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9278,
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9279,

    // WEBGL_compressed_texture_pvrtc

    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8c00,
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8c02,
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8c01,
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8c03,

    // WEBGL_compressed_texture_etc1

    COMPRESSED_RGB_ETC1_WEBGL: 0x8d64,

    // WEBGL_compressed_texture_atc

    COMPRESSED_RGB_ATC_WEBGL: 0x8c92,
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 0x8c92,
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 0x87ee,

    // WEBGL_depth_texture

    UNSIGNED_INT_24_8_WEBGL: 0x84fa,

    // OES_texture_half_float

    HALF_FLOAT_OES: 0x8d61,

    // WEBGL_color_buffer_float

    RGBA32F_EXT: 0x8814,
    RGB32F_EXT: 0x8815,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211,
    UNSIGNED_NORMALIZED_EXT: 0x8c17,

    // EXT_blend_minmax

    MIN_EXT: 0x8007,
    MAX_EXT: 0x8008,

    // EXT_sRGB

    SRGB_EXT: 0x8c40,
    SRGB_ALPHA_EXT: 0x8c42,
    SRGB8_ALPHA8_EXT: 0x8c43,
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 0x8210,

    // OES_standard_derivatives

    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8b8b,

    // WEBGL_draw_buffers

    COLOR_ATTACHMENT0_WEBGL: 0x8ce0,
    COLOR_ATTACHMENT1_WEBGL: 0x8ce1,
    COLOR_ATTACHMENT2_WEBGL: 0x8ce2,
    COLOR_ATTACHMENT3_WEBGL: 0x8ce3,
    COLOR_ATTACHMENT4_WEBGL: 0x8ce4,
    COLOR_ATTACHMENT5_WEBGL: 0x8ce5,
    COLOR_ATTACHMENT6_WEBGL: 0x8ce6,
    COLOR_ATTACHMENT7_WEBGL: 0x8ce7,
    COLOR_ATTACHMENT8_WEBGL: 0x8ce8,
    COLOR_ATTACHMENT9_WEBGL: 0x8ce9,
    COLOR_ATTACHMENT10_WEBGL: 0x8cea,
    COLOR_ATTACHMENT11_WEBGL: 0x8ceb,
    COLOR_ATTACHMENT12_WEBGL: 0x8cec,
    COLOR_ATTACHMENT13_WEBGL: 0x8ced,
    COLOR_ATTACHMENT14_WEBGL: 0x8cee,
    COLOR_ATTACHMENT15_WEBGL: 0x8cef,
    DRAW_BUFFER0_WEBGL: 0x8825,
    DRAW_BUFFER1_WEBGL: 0x8826,
    DRAW_BUFFER2_WEBGL: 0x8827,
    DRAW_BUFFER3_WEBGL: 0x8828,
    DRAW_BUFFER4_WEBGL: 0x8829,
    DRAW_BUFFER5_WEBGL: 0x882a,
    DRAW_BUFFER6_WEBGL: 0x882b,
    DRAW_BUFFER7_WEBGL: 0x882c,
    DRAW_BUFFER8_WEBGL: 0x882d,
    DRAW_BUFFER9_WEBGL: 0x882e,
    DRAW_BUFFER10_WEBGL: 0x882f,
    DRAW_BUFFER11_WEBGL: 0x8830,
    DRAW_BUFFER12_WEBGL: 0x8831,
    DRAW_BUFFER13_WEBGL: 0x8832,
    DRAW_BUFFER14_WEBGL: 0x8833,
    DRAW_BUFFER15_WEBGL: 0x8834,
    MAX_COLOR_ATTACHMENTS_WEBGL: 0x8cdf,
    MAX_DRAW_BUFFERS_WEBGL: 0x8824,

    // OES_vertex_array_object

    VERTEX_ARRAY_BINDING_OES: 0x85b5,

    // EXT_disjoint_timer_query

    QUERY_COUNTER_BITS_EXT: 0x8864,
    CURRENT_QUERY_EXT: 0x8865,
    QUERY_RESULT_EXT: 0x8866,
    QUERY_RESULT_AVAILABLE_EXT: 0x8867,
    TIME_ELAPSED_EXT: 0x88bf,
    TIMESTAMP_EXT: 0x8e28,
    GPU_DISJOINT_EXT: 0x8fbb // A Boolean indicating whether or not the GPU performed any disjoint operation.
  };

  var vs = `
#define SHADER_NAME bitmap-layer-vertex-shader

attribute vec2 texCoords;
attribute vec3 positions;
attribute vec3 positions64Low;
attribute vec3 instancePickingColors;

varying vec2 vTexCoord;

void main(void) {
  geometry.worldPosition = positions;
  geometry.uv = texCoords;
  geometry.pickingColor = instancePickingColors;

  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  vTexCoord = texCoords;

  vec4 color = vec4(0.0);
  DECKGL_FILTER_COLOR(color, geometry);
}
`;

  var fs = `
#define SHADER_NAME bitmap-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D bitmapTexture;

varying vec2 vTexCoord;

uniform float desaturate;
uniform vec4 transparentColor;
uniform vec3 tintColor;
uniform float opacity;

// apply desaturation
vec3 color_desaturate(vec3 color) {
  float luminance = (color.r + color.g + color.b) * 0.333333333;
  return mix(color, vec3(luminance), desaturate);
}

// apply tint
vec3 color_tint(vec3 color) {
  return color * tintColor;
}

// blend with background color
vec4 apply_opacity(vec3 color, float alpha) {
  return mix(transparentColor, vec4(color, 1.0), alpha);
}

void main(void) {
  vec4 bitmapColor = texture2D(bitmapTexture, vTexCoord);

  gl_FragColor = apply_opacity(color_tint(color_desaturate(bitmapColor.rgb)), bitmapColor.a * opacity);

  geometry.uv = vTexCoord;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // Copyright (c) 2015 Uber Technologies, Inc.

  const DEFAULT_TEXTURE_PARAMETERS = {
    [src.TEXTURE_MIN_FILTER]: src.LINEAR_MIPMAP_LINEAR,
    [src.TEXTURE_MAG_FILTER]: src.LINEAR,
    [src.TEXTURE_WRAP_S]: src.CLAMP_TO_EDGE,
    [src.TEXTURE_WRAP_T]: src.CLAMP_TO_EDGE
  };

  const defaultProps$1 = {
    image: {type: 'object', value: null, async: true},
    bounds: {type: 'array', value: [1, 0, 0, 1], compare: true},

    desaturate: {type: 'number', min: 0, max: 1, value: 0},
    // More context: because of the blending mode we're using for ground imagery,
    // alpha is not effective when blending the bitmap layers with the base map.
    // Instead we need to manually dim/blend rgb values with a background color.
    transparentColor: {type: 'color', value: [0, 0, 0, 0]},
    tintColor: {type: 'color', value: [255, 255, 255]}
  };

  /*
   * @class
   * @param {object} props
   * @param {number} props.transparentColor - color to interpret transparency to
   * @param {number} props.tintColor - color bias
   */
  class BitmapLayer extends core.Layer {
    getShaders() {
      return super.getShaders({vs, fs, modules: [core.project32, core.picking]});
    }

    initializeState() {
      const attributeManager = this.getAttributeManager();

      attributeManager.add({
        positions: {
          size: 3,
          type: src.DOUBLE,
          fp64: this.use64bitPositions(),
          update: this.calculatePositions,
          noAlloc: true
        }
      });

      this.setState({
        numInstances: 1,
        positions: new Float64Array(12)
      });
    }

    updateState({props, oldProps, changeFlags}) {
      // setup model first
      if (changeFlags.extensionsChanged) {
        const {gl} = this.context;
        if (this.state.model) {
          this.state.model.delete();
        }
        this.setState({model: this._getModel(gl)});
        this.getAttributeManager().invalidateAll();
      }

      if (props.image !== oldProps.image) {
        this.loadTexture(props.image);
      }

      const attributeManager = this.getAttributeManager();

      if (props.bounds !== oldProps.bounds) {
        attributeManager.invalidate('positions');
      }
    }

    finalizeState() {
      super.finalizeState();

      if (this.state.bitmapTexture) {
        this.state.bitmapTexture.delete();
      }
    }

    calculatePositions(attributes) {
      const {positions} = this.state;
      const {bounds} = this.props;
      // bounds as [minX, minY, maxX, maxY]
      if (Number.isFinite(bounds[0])) {
        /*
          (minX0, maxY3) ---- (maxX2, maxY3)
                 |                  |
                 |                  |
                 |                  |
          (minX0, minY1) ---- (maxX2, minY1)
       */
        positions[0] = bounds[0];
        positions[1] = bounds[1];
        positions[2] = 0;

        positions[3] = bounds[0];
        positions[4] = bounds[3];
        positions[5] = 0;

        positions[6] = bounds[2];
        positions[7] = bounds[3];
        positions[8] = 0;

        positions[9] = bounds[2];
        positions[10] = bounds[1];
        positions[11] = 0;
      } else {
        // [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY]]
        for (let i = 0; i < bounds.length; i++) {
          positions[i * 3 + 0] = bounds[i][0];
          positions[i * 3 + 1] = bounds[i][1];
          positions[i * 3 + 2] = bounds[i][2] || 0;
        }
      }

      attributes.value = positions;
    }

    _getModel(gl) {
      if (!gl) {
        return null;
      }

      /*
        0,0 --- 1,0
         |       |
        0,1 --- 1,1
      */
      return new core$1.Model(
        gl,
        Object.assign({}, this.getShaders(), {
          id: this.props.id,
          geometry: new core$1.Geometry({
            drawMode: src.TRIANGLE_FAN,
            vertexCount: 4,
            attributes: {
              texCoords: new Float32Array([0, 1, 0, 0, 1, 0, 1, 1])
            }
          }),
          isInstanced: false
        })
      );
    }

    draw(opts) {
      const {uniforms} = opts;
      const {bitmapTexture, model} = this.state;
      const {desaturate, transparentColor, tintColor} = this.props;

      // Render the image
      if (bitmapTexture && model) {
        model
          .setUniforms({
            ...uniforms,
            bitmapTexture,
            desaturate,
            transparentColor: transparentColor.map(x => x / 255),
            tintColor: tintColor.slice(0, 3).map(x => x / 255)
          })
          .draw();
      }
    }

    loadTexture(image) {
      const {gl} = this.context;

      if (this.state.bitmapTexture) {
        this.state.bitmapTexture.delete();
      }

      let bitmapTexture = image;
      if (!(image instanceof core$1.Texture2D)) {
        bitmapTexture = new core$1.Texture2D(gl, {
          // Browser object: Image, ImageData, HTMLCanvasElement, ImageBitmap
          data: image,
          parameters: DEFAULT_TEXTURE_PARAMETERS
        });
      }

      this.setState({bitmapTexture});
    }
  }

  BitmapLayer.layerName = 'BitmapLayer';
  BitmapLayer.defaultProps = defaultProps$1;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  // TODO

  async function loadImageBitmap(imageUrl, options = {}) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    // const blob = new Blob([new Uint8Array(arrayBuffer)]); // MIME type not needed...
    const imagebitmapOptions = options && options.imagebitmap;
    return imagebitmapOptions ? createImageBitmap(blob) : createImageBitmap(blob, imagebitmapOptions);
  }

  /*
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa(binary);
  }
  */

  var sphericalmercator = createCommonjsModule(function (module, exports) {
  var SphericalMercator = (function(){

  // Closures including constants and other precalculated values.
  var cache = {},
      D2R = Math.PI / 180,
      R2D = 180 / Math.PI,
      // 900913 properties.
      A = 6378137.0,
      MAXEXTENT = 20037508.342789244;

  function isFloat(n){
      return Number(n) === n && n % 1 !== 0;
  }

  // SphericalMercator constructor: precaches calculations
  // for fast tile lookups.
  function SphericalMercator(options) {
      options = options || {};
      this.size = options.size || 256;
      if (!cache[this.size]) {
          var size = this.size;
          var c = cache[this.size] = {};
          c.Bc = [];
          c.Cc = [];
          c.zc = [];
          c.Ac = [];
          for (var d = 0; d < 30; d++) {
              c.Bc.push(size / 360);
              c.Cc.push(size / (2 * Math.PI));
              c.zc.push(size / 2);
              c.Ac.push(size);
              size *= 2;
          }
      }
      this.Bc = cache[this.size].Bc;
      this.Cc = cache[this.size].Cc;
      this.zc = cache[this.size].zc;
      this.Ac = cache[this.size].Ac;
  }
  // Convert lon lat to screen pixel value
  //
  // - `ll` {Array} `[lon, lat]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  SphericalMercator.prototype.px = function(ll, zoom) {
    if (isFloat(zoom)) {
      var size = this.size * Math.pow(2, zoom);
      var d = size / 2;
      var bc = (size / 360);
      var cc = (size / (2 * Math.PI));
      var ac = size;
      var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
      var x = d + ll[0] * bc;
      var y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
      (x > ac) && (x = ac);
      (y > ac) && (y = ac);
      //(x < 0) && (x = 0);
      //(y < 0) && (y = 0);
      return [x, y];
    } else {
      var d = this.zc[zoom];
      var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
      var x = Math.round(d + ll[0] * this.Bc[zoom]);
      var y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * (-this.Cc[zoom]));
      (x > this.Ac[zoom]) && (x = this.Ac[zoom]);
      (y > this.Ac[zoom]) && (y = this.Ac[zoom]);
      //(x < 0) && (x = 0);
      //(y < 0) && (y = 0);
      return [x, y];
    }
  };

  // Convert screen pixel value to lon lat
  //
  // - `px` {Array} `[x, y]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  SphericalMercator.prototype.ll = function(px, zoom) {
    if (isFloat(zoom)) {
      var size = this.size * Math.pow(2, zoom);
      var bc = (size / 360);
      var cc = (size / (2 * Math.PI));
      var zc = size / 2;
      var g = (px[1] - zc) / -cc;
      var lon = (px[0] - zc) / bc;
      var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
      return [lon, lat];
    } else {
      var g = (px[1] - this.zc[zoom]) / (-this.Cc[zoom]);
      var lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];
      var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
      return [lon, lat];
    }
  };

  // Convert tile xyz value to bbox of the form `[w, s, e, n]`
  //
  // - `x` {Number} x (longitude) number.
  // - `y` {Number} y (latitude) number.
  // - `zoom` {Number} zoom.
  // - `tms_style` {Boolean} whether to compute using tms-style.
  // - `srs` {String} projection for resulting bbox (WGS84|900913).
  // - `return` {Array} bbox array of values in form `[w, s, e, n]`.
  SphericalMercator.prototype.bbox = function(x, y, zoom, tms_style, srs) {
      // Convert xyz into bbox with srs WGS84
      if (tms_style) {
          y = (Math.pow(2, zoom) - 1) - y;
      }
      // Use +y to make sure it's a number to avoid inadvertent concatenation.
      var ll = [x * this.size, (+y + 1) * this.size]; // lower left
      // Use +x to make sure it's a number to avoid inadvertent concatenation.
      var ur = [(+x + 1) * this.size, y * this.size]; // upper right
      var bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));

      // If web mercator requested reproject to 900913.
      if (srs === '900913') {
          return this.convert(bbox, '900913');
      } else {
          return bbox;
      }
  };

  // Convert bbox to xyx bounds
  //
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  // - `zoom` {Number} zoom.
  // - `tms_style` {Boolean} whether to compute using tms-style.
  // - `srs` {String} projection of input bbox (WGS84|900913).
  // - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.
  SphericalMercator.prototype.xyz = function(bbox, zoom, tms_style, srs) {
      // If web mercator provided reproject to WGS84.
      if (srs === '900913') {
          bbox = this.convert(bbox, 'WGS84');
      }

      var ll = [bbox[0], bbox[1]]; // lower left
      var ur = [bbox[2], bbox[3]]; // upper right
      var px_ll = this.px(ll, zoom);
      var px_ur = this.px(ur, zoom);
      // Y = 0 for XYZ is the top hence minY uses px_ur[1].
      var x = [ Math.floor(px_ll[0] / this.size), Math.floor((px_ur[0] - 1) / this.size) ];
      var y = [ Math.floor(px_ur[1] / this.size), Math.floor((px_ll[1] - 1) / this.size) ];
      var bounds = {
          minX: Math.min.apply(Math, x) < 0 ? 0 : Math.min.apply(Math, x),
          minY: Math.min.apply(Math, y) < 0 ? 0 : Math.min.apply(Math, y),
          maxX: Math.max.apply(Math, x),
          maxY: Math.max.apply(Math, y)
      };
      if (tms_style) {
          var tms = {
              minY: (Math.pow(2, zoom) - 1) - bounds.maxY,
              maxY: (Math.pow(2, zoom) - 1) - bounds.minY
          };
          bounds.minY = tms.minY;
          bounds.maxY = tms.maxY;
      }
      return bounds;
  };

  // Convert projection of given bbox.
  //
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  // - `to` {String} projection of output bbox (WGS84|900913). Input bbox
  //   assumed to be the "other" projection.
  // - `@return` {Object} bbox with reprojected coordinates.
  SphericalMercator.prototype.convert = function(bbox, to) {
      if (to === '900913') {
          return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(2,4)));
      } else {
          return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(2,4)));
      }
  };

  // Convert lon/lat values to 900913 x/y.
  SphericalMercator.prototype.forward = function(ll) {
      var xy = [
          A * ll[0] * D2R,
          A * Math.log(Math.tan((Math.PI*0.25) + (0.5 * ll[1] * D2R)))
      ];
      // if xy value is beyond maxextent (e.g. poles), return maxextent.
      (xy[0] > MAXEXTENT) && (xy[0] = MAXEXTENT);
      (xy[0] < -MAXEXTENT) && (xy[0] = -MAXEXTENT);
      (xy[1] > MAXEXTENT) && (xy[1] = MAXEXTENT);
      (xy[1] < -MAXEXTENT) && (xy[1] = -MAXEXTENT);
      return xy;
  };

  // Convert 900913 x/y values to lon/lat.
  SphericalMercator.prototype.inverse = function(xy) {
      return [
          (xy[0] * R2D / A),
          ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D
      ];
  };

  return SphericalMercator;

  })();

  {
      module.exports = exports = SphericalMercator;
  }
  });

  const merc = new sphericalmercator({size: 256});

  const defaultProps$2 = {
    /*
    data: object,
    visParams: object
    */
  };

  class EarthEngineLayer extends core.CompositeLayer {
    initializeState() {
      this.state = {};
    }

    updateState({props, oldProps, changeFlags}) {
      this._updateEEObject(props, oldProps, changeFlags);
      this._updateEEVisParams(props, oldProps, changeFlags);
    }

    _updateEEObject(props, oldProps, changeFlags) {
      if (!changeFlags.dataChanged) {
        return;
      }

      let eeObject = props.data;

      if (Array.isArray(props.data) && props.data.length === 0) {
        eeObject = null;
      }

      this.setState({eeObject});
    }

    async _updateEEVisParams(props, oldProps, changeFlags) {
      if (props.visParams === oldProps.visParams && !changeFlags.dataChanged) {
        return;
      }

      const {eeObject} = this.state;
      if (!eeObject) {
        return;
      }

      if (!eeObject.getMap) {
        throw new Error(
          'EarthEngineLayer only accepts data rows that are EE Objects with a getMap() method'
        );
      }

      // Evaluate map
      const map = await eeObject.getMapAsync(props.visParams);

      // Get a tile url generation function
      const getTileUrl = map.formatTileUrl.bind(map);

      this.setState({map, getTileUrl});
    }

    renderLayers() {
      const {getTileUrl} = this.state;

      return (
        getTileUrl &&
        new EnhancedTileLayer({
          // TODO HACK Get a tile url to trigger refresh on dataset change
          id: getTileUrl(0, 0, 0),
          async getTileData({x, y, z}) {
            const imageUrl = getTileUrl(x, y, z);
            const image = await loadImageBitmap(imageUrl);
            // const imageData = await getImageData(image);

            const bounds = merc.bbox(x, y, z);

            // const meshGrid = createMeshGrid(bounds, imageData);
            // const terrain = getGrayScaleData(imageData);
            // const tile = martini.createTile(terrain);
            // const mesh = tile.getMesh(10);
            // console.debug(`loaded tile ${x}/${y}/${z}`, bounds);

            return {
              id: `${z}/${x}/${y}`,
              image,
              bounds
            };
          },

          renderSubLayers(props) {
            // console.debug(props.data.meshGrid);

            return (
              props.data.image && [
                /*
              new SimpleMeshLayer({
                ...props.data,
                data: [{0, 0}]
                mesh: {
                  header: {vertexCount: 0},
                  attributes: {
                    POSITION: {},
                    NORMAL: {},
                    TEXCOORD_0: {value}
                  }
                }
              }),
              new ColumnLayer({
                id: `${props.id}-pt`,
                data: props.data.meshGrid,
                extruded: true,
                radius: 30,
                getPosition: d => [d[0], d[1]],
                getRadius: 0.01,
                getFillColor: d => [0, d[2][1], d[2][2]],
                getElevation: d => d[2][0] * 10,
                opacity: 1
              }),
              */
                // new ScatterplotLayer({
                //   id: `${props.id}-pt`,
                //   data: props.data.meshGrid,
                //   extruded: true,
                //   radius: 30,
                //   getPosition: d => [d[0], d[1]],
                //   getRadius: 0.01,
                //   getFillColor: d => [0, d[2][1], d[2][2]],
                //   getElevation: d => d[2][0] * 10,
                //   opacity: 1
                // }),
                new BitmapLayer({
                  ...props.data
                  // opacity: 0.2
                })
              ]
            );
          }
        })
      );
    }
  }

  EarthEngineLayer.layerName = 'EarthEngineLayer';
  EarthEngineLayer.defaultProps = defaultProps$2;

  /* global window, global */
  const customLayerLibrary = {
    EarthEngineLayer
  };

  const _global = typeof window === 'undefined' ? global : window;
  _global.customLayerLibrary = customLayerLibrary;

  return customLayerLibrary;

}(deck, deck, luma));
