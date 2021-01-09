;(() => {
  var e,
    r,
    t = {},
    o = {}
  function a(e) {
    if (o[e]) return o[e].exports
    var r = (o[e] = { id: e, exports: {} })
    return t[e](r, r.exports, a), r.exports
  }
  ;(a.m = t),
    (a.n = (e) => {
      var r = e && e.__esModule ? () => e.default : () => e
      return a.d(r, { a: r }), r
    }),
    (a.d = (e, r) => {
      for (var t in r)
        a.o(r, t) &&
          !a.o(e, t) &&
          Object.defineProperty(e, t, { enumerable: !0, get: r[t] })
    }),
    (a.f = {}),
    (a.e = (e) =>
      Promise.all(Object.keys(a.f).reduce((r, t) => (a.f[t](e, r), r), []))),
    (a.u = (e) => e + '.js'),
    (a.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
    (e = {}),
    (r = 'wp5-starter-react:'),
    (a.l = (t, o, n) => {
      if (e[t]) e[t].push(o)
      else {
        var i, l
        if (void 0 !== n)
          for (
            var u = document.getElementsByTagName('script'), s = 0;
            s < u.length;
            s++
          ) {
            var d = u[s]
            if (
              d.getAttribute('src') == t ||
              d.getAttribute('data-webpack') == r + n
            ) {
              i = d
              break
            }
          }
        i ||
          ((l = !0),
          ((i = document.createElement('script')).charset = 'utf-8'),
          (i.timeout = 120),
          a.nc && i.setAttribute('nonce', a.nc),
          i.setAttribute('data-webpack', r + n),
          (i.src = t)),
          (e[t] = [o])
        var p = (r, o) => {
            ;(i.onerror = i.onload = null), clearTimeout(c)
            var a = e[t]
            if (
              (delete e[t],
              i.parentNode && i.parentNode.removeChild(i),
              a && a.forEach((e) => e(o)),
              r)
            )
              return r(o)
          },
          c = setTimeout(
            p.bind(null, void 0, { type: 'timeout', target: i }),
            12e4
          )
        ;(i.onerror = p.bind(null, i.onerror)),
          (i.onload = p.bind(null, i.onload)),
          l && document.head.appendChild(i)
      }
    }),
    (a.r = (e) => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 })
    }),
    (a.p = 'http://localhost:8080/'),
    (() => {
      var e = { 42: 0 }
      a.f.j = (r, t) => {
        var o = a.o(e, r) ? e[r] : void 0
        if (0 !== o)
          if (o) t.push(o[2])
          else {
            var n = new Promise((t, a) => {
              o = e[r] = [t, a]
            })
            t.push((o[2] = n))
            var i = a.p + a.u(r),
              l = new Error()
            a.l(
              i,
              (t) => {
                if (a.o(e, r) && (0 !== (o = e[r]) && (e[r] = void 0), o)) {
                  var n = t && ('load' === t.type ? 'missing' : t.type),
                    i = t && t.target && t.target.src
                  ;(l.message =
                    'Loading chunk ' + r + ' failed.\n(' + n + ': ' + i + ')'),
                    (l.name = 'ChunkLoadError'),
                    (l.type = n),
                    (l.request = i),
                    o[1](l)
                }
              },
              'chunk-' + r
            )
          }
      }
      var r = (self.webpackChunkwp5_starter_react =
          self.webpackChunkwp5_starter_react || []),
        t = r.push.bind(r)
      r.push = (r) => {
        for (var o, n, [i, l, u] = r, s = 0, d = []; s < i.length; s++)
          (n = i[s]), a.o(e, n) && e[n] && d.push(e[n][0]), (e[n] = 0)
        for (o in l) a.o(l, o) && (a.m[o] = l[o])
        for (u && u(a), t(r); d.length; ) d.shift()()
      }
    })(),
    Promise.all([a.e(943), a.e(311)]).then(a.bind(a, 311))
})()
