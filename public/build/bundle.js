
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsvFormat(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv$1 = dsvFormat(",");

    var csvParse = csv$1.parse;

    function responseText(response) {
      if (!response.ok) throw new Error(response.status + " " + response.statusText);
      return response.text();
    }

    function text(input, init) {
      return fetch(input, init).then(responseText);
    }

    function dsvParse(parse) {
      return function(input, init, row) {
        if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
        return text(input, init).then(function(response) {
          return parse(response, row);
        });
      };
    }

    var csv = dsvParse(csvParse);

    function Transform(k, x, y) {
      this.k = k;
      this.x = x;
      this.y = y;
    }

    Transform.prototype = {
      constructor: Transform,
      scale: function(k) {
        return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
      },
      translate: function(x, y) {
        return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
      },
      apply: function(point) {
        return [point[0] * this.k + this.x, point[1] * this.k + this.y];
      },
      applyX: function(x) {
        return x * this.k + this.x;
      },
      applyY: function(y) {
        return y * this.k + this.y;
      },
      invert: function(location) {
        return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
      },
      invertX: function(x) {
        return (x - this.x) / this.k;
      },
      invertY: function(y) {
        return (y - this.y) / this.k;
      },
      rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
      },
      rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
      },
      toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
      }
    };

    Transform.prototype;

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_11(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_12(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_13(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_14(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    // (121:2) {#each options as option}
    function create_each_block_14(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[38] + "";
    	let t;
    	let option_disabled_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text$1(t_value);
    			option.__value = /*option*/ ctx[38];
    			option.value = option.__value;
    			option.disabled = option_disabled_value = /*option*/ ctx[38] === /*option2*/ ctx[1] || /*option*/ ctx[38] === /*option3*/ ctx[2];
    			add_location(option, file, 121, 4, 3221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*option2, option3, options*/ 131078 && option_disabled_value !== (option_disabled_value = /*option*/ ctx[38] === /*option2*/ ctx[1] || /*option*/ ctx[38] === /*option3*/ ctx[2])) {
    				prop_dev(option, "disabled", option_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_14.name,
    		type: "each",
    		source: "(121:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    // (125:3) {#if option1 !== ''}
    function create_if_block_4(ctx) {
    	let p;
    	let t1;
    	let div8;
    	let div1;
    	let div0;
    	let t2;
    	let span0;
    	let t4;
    	let div3;
    	let div2;
    	let t5;
    	let span1;
    	let t7;
    	let div5;
    	let div4;
    	let t8;
    	let span2;
    	let t10;
    	let div7;
    	let div6;
    	let t11;
    	let span3;
    	let t13;
    	let div9;

    	function select_block_type(ctx, dirty) {
    		if (/*zip_white1*/ ctx[5] !== null) return create_if_block_5;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Demographic breakdown";
    			t1 = space();
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "White";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "Black";
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t8 = space();
    			span2 = element("span");
    			span2.textContent = "Asian";
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t11 = space();
    			span3 = element("span");
    			span3.textContent = "Native American";
    			t13 = space();
    			div9 = element("div");
    			if_block.c();
    			add_location(p, file, 125, 4, 3365);
    			attr_dev(div0, "class", "square_white svelte-98twwo");
    			add_location(div0, file, 128, 5, 3453);
    			attr_dev(span0, "class", "svelte-98twwo");
    			add_location(span0, file, 129, 5, 3491);
    			attr_dev(div1, "class", "legend-item svelte-98twwo");
    			add_location(div1, file, 127, 3, 3422);
    			attr_dev(div2, "class", "square_black svelte-98twwo");
    			add_location(div2, file, 132, 5, 3554);
    			attr_dev(span1, "class", "svelte-98twwo");
    			add_location(span1, file, 133, 5, 3592);
    			attr_dev(div3, "class", "legend-item svelte-98twwo");
    			add_location(div3, file, 131, 3, 3523);
    			attr_dev(div4, "class", "square_asian svelte-98twwo");
    			add_location(div4, file, 136, 5, 3655);
    			attr_dev(span2, "class", "svelte-98twwo");
    			add_location(span2, file, 137, 5, 3693);
    			attr_dev(div5, "class", "legend-item svelte-98twwo");
    			add_location(div5, file, 135, 3, 3624);
    			attr_dev(div6, "class", "square_indian svelte-98twwo");
    			add_location(div6, file, 140, 5, 3756);
    			attr_dev(span3, "class", "svelte-98twwo");
    			add_location(span3, file, 141, 5, 3795);
    			attr_dev(div7, "class", "legend-item svelte-98twwo");
    			add_location(div7, file, 139, 3, 3725);
    			attr_dev(div8, "class", "legend svelte-98twwo");
    			add_location(div8, file, 126, 4, 3398);
    			attr_dev(div9, "class", "population svelte-98twwo");
    			add_location(div9, file, 145, 2, 3850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, span0);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t5);
    			append_dev(div3, span1);
    			append_dev(div8, t7);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t8);
    			append_dev(div5, span2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t11);
    			append_dev(div7, span3);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div9, anchor);
    			if_block.m(div9, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div9, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div9);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(125:3) {#if option1 !== ''}",
    		ctx
    	});

    	return block;
    }

    // (160:4) {:else}
    function create_else_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No population data available for selected ZIP code";
    			add_location(p, file, 160, 3, 4330);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(160:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (147:4) {#if zip_white1 !== null}
    function create_if_block_5(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let each3_anchor;
    	let each_value_13 = Array(Math.ceil(/*zip_white1*/ ctx[5] / 10));
    	validate_each_argument(each_value_13);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_13.length; i += 1) {
    		each_blocks_3[i] = create_each_block_13(get_each_context_13(ctx, each_value_13, i));
    	}

    	let each_value_12 = Array(Math.ceil(/*zip_black1*/ ctx[8] / 10));
    	validate_each_argument(each_value_12);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_12.length; i += 1) {
    		each_blocks_2[i] = create_each_block_12(get_each_context_12(ctx, each_value_12, i));
    	}

    	let each_value_11 = Array(Math.ceil(/*zip_asian1*/ ctx[11] / 10));
    	validate_each_argument(each_value_11);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_11.length; i += 1) {
    		each_blocks_1[i] = create_each_block_11(get_each_context_11(ctx, each_value_11, i));
    	}

    	let each_value_10 = Array(Math.ceil(/*zip_indian1*/ ctx[14] / 10));
    	validate_each_argument(each_value_10);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_10.length; i += 1) {
    		each_blocks[i] = create_each_block_10(get_each_context_10(ctx, each_value_10, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each3_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each3_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*zip_white1*/ 32) {
    				each_value_13 = Array(Math.ceil(/*zip_white1*/ ctx[5] / 10));
    				validate_each_argument(each_value_13);
    				let i;

    				for (i = 0; i < each_value_13.length; i += 1) {
    					const child_ctx = get_each_context_13(ctx, each_value_13, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_13(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_13.length;
    			}

    			if (dirty[0] & /*zip_black1*/ 256) {
    				each_value_12 = Array(Math.ceil(/*zip_black1*/ ctx[8] / 10));
    				validate_each_argument(each_value_12);
    				let i;

    				for (i = 0; i < each_value_12.length; i += 1) {
    					const child_ctx = get_each_context_12(ctx, each_value_12, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_12(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_12.length;
    			}

    			if (dirty[0] & /*zip_asian1*/ 2048) {
    				each_value_11 = Array(Math.ceil(/*zip_asian1*/ ctx[11] / 10));
    				validate_each_argument(each_value_11);
    				let i;

    				for (i = 0; i < each_value_11.length; i += 1) {
    					const child_ctx = get_each_context_11(ctx, each_value_11, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_11(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_11.length;
    			}

    			if (dirty[0] & /*zip_indian1*/ 16384) {
    				each_value_10 = Array(Math.ceil(/*zip_indian1*/ ctx[14] / 10));
    				validate_each_argument(each_value_10);
    				let i;

    				for (i = 0; i < each_value_10.length; i += 1) {
    					const child_ctx = get_each_context_10(ctx, each_value_10, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_10(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each3_anchor.parentNode, each3_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_10.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_3, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(147:4) {#if zip_white1 !== null}",
    		ctx
    	});

    	return block;
    }

    // (148:3) {#each Array(Math.ceil(zip_white1 / 10)) as _, i}
    function create_each_block_13(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_white svelte-98twwo");
    			add_location(div, file, 148, 5, 3963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_13.name,
    		type: "each",
    		source: "(148:3) {#each Array(Math.ceil(zip_white1 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (151:3) {#each Array(Math.ceil(zip_black1 / 10)) as _, i}
    function create_each_block_12(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_black svelte-98twwo");
    			add_location(div, file, 151, 5, 4065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_12.name,
    		type: "each",
    		source: "(151:3) {#each Array(Math.ceil(zip_black1 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (154:3) {#each Array(Math.ceil(zip_asian1 / 10)) as _, i}
    function create_each_block_11(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_asian svelte-98twwo");
    			add_location(div, file, 154, 5, 4167);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_11.name,
    		type: "each",
    		source: "(154:3) {#each Array(Math.ceil(zip_asian1 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (157:3) {#each Array(Math.ceil(zip_indian1 / 10)) as _, i}
    function create_each_block_10(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_indian svelte-98twwo");
    			add_location(div, file, 157, 5, 4270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_10.name,
    		type: "each",
    		source: "(157:3) {#each Array(Math.ceil(zip_indian1 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (170:2) {#each options as option}
    function create_each_block_9(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[38] + "";
    	let t;
    	let option_disabled_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text$1(t_value);
    			option.__value = /*option*/ ctx[38];
    			option.value = option.__value;
    			option.disabled = option_disabled_value = /*option*/ ctx[38] === /*option1*/ ctx[0] || /*option*/ ctx[38] === /*option3*/ ctx[2];
    			add_location(option, file, 170, 4, 4591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*option1, option3, options*/ 131077 && option_disabled_value !== (option_disabled_value = /*option*/ ctx[38] === /*option1*/ ctx[0] || /*option*/ ctx[38] === /*option3*/ ctx[2])) {
    				prop_dev(option, "disabled", option_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(170:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    // (174:3) {#if option2 !== ''}
    function create_if_block_2(ctx) {
    	let p;
    	let t1;
    	let div8;
    	let div1;
    	let div0;
    	let t2;
    	let span0;
    	let t4;
    	let div3;
    	let div2;
    	let t5;
    	let span1;
    	let t7;
    	let div5;
    	let div4;
    	let t8;
    	let span2;
    	let t10;
    	let div7;
    	let div6;
    	let t11;
    	let span3;
    	let t13;
    	let div9;

    	function select_block_type_1(ctx, dirty) {
    		if (/*zip_pop2*/ ctx[3] !== null) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Demographic breakdown";
    			t1 = space();
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "White";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "Black";
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t8 = space();
    			span2 = element("span");
    			span2.textContent = "Asian";
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t11 = space();
    			span3 = element("span");
    			span3.textContent = "Native American";
    			t13 = space();
    			div9 = element("div");
    			if_block.c();
    			add_location(p, file, 174, 2, 4733);
    			attr_dev(div0, "class", "square_white svelte-98twwo");
    			add_location(div0, file, 177, 5, 4819);
    			attr_dev(span0, "class", "svelte-98twwo");
    			add_location(span0, file, 178, 5, 4857);
    			attr_dev(div1, "class", "legend-item svelte-98twwo");
    			add_location(div1, file, 176, 3, 4788);
    			attr_dev(div2, "class", "square_black svelte-98twwo");
    			add_location(div2, file, 181, 5, 4920);
    			attr_dev(span1, "class", "svelte-98twwo");
    			add_location(span1, file, 182, 5, 4958);
    			attr_dev(div3, "class", "legend-item svelte-98twwo");
    			add_location(div3, file, 180, 3, 4889);
    			attr_dev(div4, "class", "square_asian svelte-98twwo");
    			add_location(div4, file, 185, 5, 5021);
    			attr_dev(span2, "class", "svelte-98twwo");
    			add_location(span2, file, 186, 5, 5059);
    			attr_dev(div5, "class", "legend-item svelte-98twwo");
    			add_location(div5, file, 184, 3, 4990);
    			attr_dev(div6, "class", "square_indian svelte-98twwo");
    			add_location(div6, file, 189, 5, 5122);
    			attr_dev(span3, "class", "svelte-98twwo");
    			add_location(span3, file, 190, 5, 5161);
    			attr_dev(div7, "class", "legend-item svelte-98twwo");
    			add_location(div7, file, 188, 3, 5091);
    			attr_dev(div8, "class", "legend svelte-98twwo");
    			add_location(div8, file, 175, 2, 4764);
    			attr_dev(div9, "class", "population svelte-98twwo");
    			add_location(div9, file, 194, 2, 5216);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, span0);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t5);
    			append_dev(div3, span1);
    			append_dev(div8, t7);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t8);
    			append_dev(div5, span2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t11);
    			append_dev(div7, span3);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div9, anchor);
    			if_block.m(div9, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div9, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div9);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(174:3) {#if option2 !== ''}",
    		ctx
    	});

    	return block;
    }

    // (209:4) {:else}
    function create_else_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No population data available for selected ZIP code";
    			add_location(p, file, 209, 3, 5694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(209:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (196:4) {#if zip_pop2 !== null}
    function create_if_block_3(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let each3_anchor;
    	let each_value_8 = Array(Math.ceil(/*zip_white2*/ ctx[6] / 10));
    	validate_each_argument(each_value_8);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks_3[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	let each_value_7 = Array(Math.ceil(/*zip_black2*/ ctx[9] / 10));
    	validate_each_argument(each_value_7);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks_2[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	let each_value_6 = Array(Math.ceil(/*zip_asian2*/ ctx[12] / 10));
    	validate_each_argument(each_value_6);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks_1[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	let each_value_5 = Array(Math.ceil(/*zip_indian2*/ ctx[15] / 10));
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each3_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each3_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*zip_white2*/ 64) {
    				each_value_8 = Array(Math.ceil(/*zip_white2*/ ctx[6] / 10));
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_8(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_8.length;
    			}

    			if (dirty[0] & /*zip_black2*/ 512) {
    				each_value_7 = Array(Math.ceil(/*zip_black2*/ ctx[9] / 10));
    				validate_each_argument(each_value_7);
    				let i;

    				for (i = 0; i < each_value_7.length; i += 1) {
    					const child_ctx = get_each_context_7(ctx, each_value_7, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_7(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_7.length;
    			}

    			if (dirty[0] & /*zip_asian2*/ 4096) {
    				each_value_6 = Array(Math.ceil(/*zip_asian2*/ ctx[12] / 10));
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_6(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_6.length;
    			}

    			if (dirty[0] & /*zip_indian2*/ 32768) {
    				each_value_5 = Array(Math.ceil(/*zip_indian2*/ ctx[15] / 10));
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each3_anchor.parentNode, each3_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_3, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(196:4) {#if zip_pop2 !== null}",
    		ctx
    	});

    	return block;
    }

    // (197:3) {#each Array(Math.ceil(zip_white2 / 10)) as _, i}
    function create_each_block_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_white svelte-98twwo");
    			add_location(div, file, 197, 5, 5327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(197:3) {#each Array(Math.ceil(zip_white2 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (200:3) {#each Array(Math.ceil(zip_black2 / 10)) as _, i}
    function create_each_block_7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_black svelte-98twwo");
    			add_location(div, file, 200, 5, 5429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(200:3) {#each Array(Math.ceil(zip_black2 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (203:3) {#each Array(Math.ceil(zip_asian2 / 10)) as _, i}
    function create_each_block_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_asian svelte-98twwo");
    			add_location(div, file, 203, 5, 5531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(203:3) {#each Array(Math.ceil(zip_asian2 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (206:3) {#each Array(Math.ceil(zip_indian2 / 10)) as _, i}
    function create_each_block_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_indian svelte-98twwo");
    			add_location(div, file, 206, 5, 5634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(206:3) {#each Array(Math.ceil(zip_indian2 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (219:2) {#each options as option}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[38] + "";
    	let t;
    	let option_disabled_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text$1(t_value);
    			option.__value = /*option*/ ctx[38];
    			option.value = option.__value;
    			option.disabled = option_disabled_value = /*option*/ ctx[38] === /*option1*/ ctx[0] || /*option*/ ctx[38] === /*option2*/ ctx[1];
    			add_location(option, file, 219, 4, 5955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*option1, option2, options*/ 131075 && option_disabled_value !== (option_disabled_value = /*option*/ ctx[38] === /*option1*/ ctx[0] || /*option*/ ctx[38] === /*option2*/ ctx[1])) {
    				prop_dev(option, "disabled", option_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(219:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    // (223:3) {#if option3 !== ''}
    function create_if_block(ctx) {
    	let p;
    	let t1;
    	let div8;
    	let div1;
    	let div0;
    	let t2;
    	let span0;
    	let t4;
    	let div3;
    	let div2;
    	let t5;
    	let span1;
    	let t7;
    	let div5;
    	let div4;
    	let t8;
    	let span2;
    	let t10;
    	let div7;
    	let div6;
    	let t11;
    	let span3;
    	let t13;
    	let div9;

    	function select_block_type_2(ctx, dirty) {
    		if (/*zip_pop3*/ ctx[4] !== null) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Demographic breakdown";
    			t1 = space();
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "White";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "Black";
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t8 = space();
    			span2 = element("span");
    			span2.textContent = "Asian";
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t11 = space();
    			span3 = element("span");
    			span3.textContent = "Native American";
    			t13 = space();
    			div9 = element("div");
    			if_block.c();
    			add_location(p, file, 223, 3, 6098);
    			attr_dev(div0, "class", "square_white svelte-98twwo");
    			add_location(div0, file, 227, 5, 6187);
    			attr_dev(span0, "class", "svelte-98twwo");
    			add_location(span0, file, 228, 5, 6225);
    			attr_dev(div1, "class", "legend-item svelte-98twwo");
    			add_location(div1, file, 226, 3, 6156);
    			attr_dev(div2, "class", "square_black svelte-98twwo");
    			add_location(div2, file, 231, 5, 6288);
    			attr_dev(span1, "class", "svelte-98twwo");
    			add_location(span1, file, 232, 5, 6326);
    			attr_dev(div3, "class", "legend-item svelte-98twwo");
    			add_location(div3, file, 230, 3, 6257);
    			attr_dev(div4, "class", "square_asian svelte-98twwo");
    			add_location(div4, file, 235, 5, 6389);
    			attr_dev(span2, "class", "svelte-98twwo");
    			add_location(span2, file, 236, 5, 6427);
    			attr_dev(div5, "class", "legend-item svelte-98twwo");
    			add_location(div5, file, 234, 3, 6358);
    			attr_dev(div6, "class", "square_indian svelte-98twwo");
    			add_location(div6, file, 239, 5, 6490);
    			attr_dev(span3, "class", "svelte-98twwo");
    			add_location(span3, file, 240, 5, 6529);
    			attr_dev(div7, "class", "legend-item svelte-98twwo");
    			add_location(div7, file, 238, 3, 6459);
    			attr_dev(div8, "class", "legend svelte-98twwo");
    			add_location(div8, file, 225, 2, 6132);
    			attr_dev(div9, "class", "population svelte-98twwo");
    			add_location(div9, file, 244, 2, 6584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, span0);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t5);
    			append_dev(div3, span1);
    			append_dev(div8, t7);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t8);
    			append_dev(div5, span2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t11);
    			append_dev(div7, span3);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div9, anchor);
    			if_block.m(div9, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div9, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div9);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(223:3) {#if option3 !== ''}",
    		ctx
    	});

    	return block;
    }

    // (259:4) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No population data available for selected ZIP code";
    			add_location(p, file, 259, 3, 7062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(259:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (246:4) {#if zip_pop3 !== null}
    function create_if_block_1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let each3_anchor;
    	let each_value_3 = Array(Math.ceil(/*zip_white3*/ ctx[7] / 10));
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = Array(Math.ceil(/*zip_black3*/ ctx[10] / 10));
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = Array(Math.ceil(/*zip_asian3*/ ctx[13] / 10));
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = Array(Math.ceil(/*zip_indian3*/ ctx[16] / 10));
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each3_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each3_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*zip_white3*/ 128) {
    				each_value_3 = Array(Math.ceil(/*zip_white3*/ ctx[7] / 10));
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*zip_black3*/ 1024) {
    				each_value_2 = Array(Math.ceil(/*zip_black3*/ ctx[10] / 10));
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*zip_asian3*/ 8192) {
    				each_value_1 = Array(Math.ceil(/*zip_asian3*/ ctx[13] / 10));
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*zip_indian3*/ 65536) {
    				each_value = Array(Math.ceil(/*zip_indian3*/ ctx[16] / 10));
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each3_anchor.parentNode, each3_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_3, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(246:4) {#if zip_pop3 !== null}",
    		ctx
    	});

    	return block;
    }

    // (247:3) {#each Array(Math.ceil(zip_white3 / 10)) as _, i}
    function create_each_block_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_white svelte-98twwo");
    			add_location(div, file, 247, 5, 6695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(247:3) {#each Array(Math.ceil(zip_white3 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (250:3) {#each Array(Math.ceil(zip_black3 / 10)) as _, i}
    function create_each_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_black svelte-98twwo");
    			add_location(div, file, 250, 5, 6797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(250:3) {#each Array(Math.ceil(zip_black3 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (253:3) {#each Array(Math.ceil(zip_asian3 / 10)) as _, i}
    function create_each_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_asian svelte-98twwo");
    			add_location(div, file, 253, 5, 6899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(253:3) {#each Array(Math.ceil(zip_asian3 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (256:3) {#each Array(Math.ceil(zip_indian3 / 10)) as _, i}
    function create_each_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square_indian svelte-98twwo");
    			add_location(div, file, 256, 5, 7002);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(256:3) {#each Array(Math.ceil(zip_indian3 / 10)) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div3;
    	let div0;
    	let select0;
    	let option0;
    	let t1;
    	let t2;
    	let div1;
    	let select1;
    	let option1_1;
    	let t4;
    	let t5;
    	let div2;
    	let select2;
    	let option2_1;
    	let t7;
    	let mounted;
    	let dispose;
    	let each_value_14 = /*options*/ ctx[17];
    	validate_each_argument(each_value_14);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_14.length; i += 1) {
    		each_blocks_2[i] = create_each_block_14(get_each_context_14(ctx, each_value_14, i));
    	}

    	let if_block0 = /*option1*/ ctx[0] !== '' && create_if_block_4(ctx);
    	let each_value_9 = /*options*/ ctx[17];
    	validate_each_argument(each_value_9);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks_1[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
    	}

    	let if_block1 = /*option2*/ ctx[1] !== '' && create_if_block_2(ctx);
    	let each_value_4 = /*options*/ ctx[17];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let if_block2 = /*option3*/ ctx[2] !== '' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Zip:";

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div1 = element("div");
    			select1 = element("select");
    			option1_1 = element("option");
    			option1_1.textContent = "Zip:";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div2 = element("div");
    			select2 = element("select");
    			option2_1 = element("option");
    			option2_1.textContent = "Zip:";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			if (if_block2) if_block2.c();
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 119, 2, 3158);
    			if (/*option1*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[19].call(select0));
    			add_location(select0, file, 118, 3, 3082);
    			attr_dev(div0, "class", "column svelte-98twwo");
    			add_location(div0, file, 117, 1, 3058);
    			option1_1.__value = "";
    			option1_1.value = option1_1.__value;
    			add_location(option1_1, file, 168, 2, 4528);
    			if (/*option2*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[21].call(select1));
    			add_location(select1, file, 167, 3, 4452);
    			attr_dev(div1, "class", "column svelte-98twwo");
    			add_location(div1, file, 166, 1, 4428);
    			option2_1.__value = "";
    			option2_1.value = option2_1.__value;
    			add_location(option2_1, file, 217, 2, 5892);
    			if (/*option3*/ ctx[2] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[23].call(select2));
    			add_location(select2, file, 216, 3, 5816);
    			attr_dev(div2, "class", "column svelte-98twwo");
    			add_location(div2, file, 215, 1, 5792);
    			attr_dev(div3, "class", "container svelte-98twwo");
    			add_location(div3, file, 116, 2, 3033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(select0, null);
    				}
    			}

    			select_option(select0, /*option1*/ ctx[0], true);
    			append_dev(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, select1);
    			append_dev(select1, option1_1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*option2*/ ctx[1], true);
    			append_dev(div1, t4);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, select2);
    			append_dev(select2, option2_1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select2, null);
    				}
    			}

    			select_option(select2, /*option3*/ ctx[2], true);
    			append_dev(div2, t7);
    			if (if_block2) if_block2.m(div2, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[19]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[20], false, false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[21]),
    					listen_dev(select1, "change", /*change_handler_1*/ ctx[22], false, false, false, false),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[23]),
    					listen_dev(select2, "change", /*change_handler_2*/ ctx[24], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*options, option2, option3*/ 131078) {
    				each_value_14 = /*options*/ ctx[17];
    				validate_each_argument(each_value_14);
    				let i;

    				for (i = 0; i < each_value_14.length; i += 1) {
    					const child_ctx = get_each_context_14(ctx, each_value_14, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_14(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_14.length;
    			}

    			if (dirty[0] & /*option1, options*/ 131073) {
    				select_option(select0, /*option1*/ ctx[0]);
    			}

    			if (/*option1*/ ctx[0] !== '') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*options, option1, option3*/ 131077) {
    				each_value_9 = /*options*/ ctx[17];
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_9(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_9.length;
    			}

    			if (dirty[0] & /*option2, options*/ 131074) {
    				select_option(select1, /*option2*/ ctx[1]);
    			}

    			if (/*option2*/ ctx[1] !== '') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*options, option1, option2*/ 131075) {
    				each_value_4 = /*options*/ ctx[17];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*option3, options*/ 131076) {
    				select_option(select2, /*option3*/ ctx[2]);
    			}

    			if (/*option3*/ ctx[2] !== '') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_2, detaching);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let options = [
    		"02024",
    		"02026",
    		"02028",
    		"02108",
    		"02110",
    		"02111",
    		"02112",
    		"02113",
    		"02114",
    		"02115",
    		"02119",
    		"02120",
    		"02121",
    		"02122",
    		"02124",
    		"02125",
    		"02126",
    		"02127",
    		"02128",
    		"02129",
    		"02130",
    		"02131",
    		"02132",
    		"02134",
    		"02135",
    		"02136",
    		"02137",
    		"02138",
    		"02169",
    		"02171",
    		"02186",
    		"02199",
    		"02201",
    		"02205",
    		"02214",
    		"02218",
    		"02228",
    		"02251",
    		"02445",
    		"02446",
    		"02458",
    		"02459",
    		"02465",
    		"02467",
    		"02494"
    	];

    	let option1 = '';
    	let option2 = '';
    	let option3 = '';
    	let selectedZIP1 = '';
    	let selectedZIP2 = '';
    	let selectedZIP3 = '';
    	let zip_pop1 = null;
    	let zip_pop2 = null;
    	let zip_pop3 = null;
    	let zip_white1 = null;
    	let zip_white2 = null;
    	let zip_white3 = null;
    	let zip_black1 = null;
    	let zip_black2 = null;
    	let zip_black3 = null;
    	let zip_asian1 = null;
    	let zip_asian2 = null;
    	let zip_asian3 = null;
    	let zip_indian1 = null;
    	let zip_indian2 = null;
    	let zip_indian3 = null;
    	let zip_data = null;

    	function handleOptionSelect(column, option) {
    		if (column === 1) {
    			$$invalidate(0, option1 = option);
    		} else if (column === 2) {
    			$$invalidate(1, option2 = option);
    		} else if (column === 3) {
    			$$invalidate(2, option3 = option);
    		}
    	}

    	async function fetchData() {
    		try {
    			const data = await csv('/averaged_by_zip.csv');
    			zip_data = data;
    		} catch(error) {
    			console.error('Error fetching data:', error);
    		}
    	}

    	onMount(fetchData);

    	function handleZIPChange(column, event) {
    		const selectedZip = event.target.value;
    		const selectedZipData = zip_data.find(row => row.zip === selectedZip);

    		if (selectedZipData) {
    			if (column === 1) {
    				selectedZIP1 = selectedZip;
    				zip_pop1 = selectedZipData.pop;
    				$$invalidate(5, zip_white1 = selectedZipData.pop_white);
    				$$invalidate(8, zip_black1 = selectedZipData.pop_black);
    				$$invalidate(11, zip_asian1 = selectedZipData.pop_asian);
    				$$invalidate(14, zip_indian1 = selectedZipData.pop_american_indian);
    			} else if (column === 2) {
    				selectedZIP2 = selectedZip;
    				$$invalidate(3, zip_pop2 = selectedZipData.pop);
    				$$invalidate(6, zip_white2 = selectedZipData.pop_white);
    				$$invalidate(9, zip_black2 = selectedZipData.pop_black);
    				$$invalidate(12, zip_asian2 = selectedZipData.pop_asian);
    				$$invalidate(15, zip_indian2 = selectedZipData.pop_american_indian);
    			} else if (column === 3) {
    				selectedZIP3 = selectedZip;
    				$$invalidate(4, zip_pop3 = selectedZipData.pop);
    				$$invalidate(7, zip_white3 = selectedZipData.pop_white);
    				$$invalidate(10, zip_black3 = selectedZipData.pop_black);
    				$$invalidate(13, zip_asian3 = selectedZipData.pop_asian);
    				$$invalidate(16, zip_indian3 = selectedZipData.pop_american_indian);
    			}
    		} else {
    			if (column === 1) {
    				selectedZIP1 = '';
    				zip_pop1 = null;
    				$$invalidate(5, zip_white1 = null);
    				$$invalidate(8, zip_black1 = null);
    				$$invalidate(11, zip_asian1 = null);
    				$$invalidate(14, zip_indian1 = null);
    			} else if (column === 2) {
    				selectedZIP2 = '';
    				$$invalidate(3, zip_pop2 = null);
    				$$invalidate(6, zip_white2 = null);
    				$$invalidate(9, zip_black2 = null);
    				$$invalidate(12, zip_asian2 = null);
    				$$invalidate(15, zip_indian2 = null);
    			} else if (column === 3) {
    				selectedZIP3 = '';
    				$$invalidate(4, zip_pop3 = null);
    				$$invalidate(7, zip_white3 = null);
    				$$invalidate(10, zip_black3 = null);
    				$$invalidate(13, zip_asian3 = null);
    				$$invalidate(16, zip_indian3 = null);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		option1 = select_value(this);
    		$$invalidate(0, option1);
    		$$invalidate(17, options);
    	}

    	const change_handler = () => handleZIPChange(1, event);

    	function select1_change_handler() {
    		option2 = select_value(this);
    		$$invalidate(1, option2);
    		$$invalidate(17, options);
    	}

    	const change_handler_1 = () => handleZIPChange(2, event);

    	function select2_change_handler() {
    		option3 = select_value(this);
    		$$invalidate(2, option3);
    		$$invalidate(17, options);
    	}

    	const change_handler_2 = () => handleZIPChange(3, event);

    	$$self.$capture_state = () => ({
    		options,
    		option1,
    		option2,
    		option3,
    		selectedZIP1,
    		selectedZIP2,
    		selectedZIP3,
    		zip_pop1,
    		zip_pop2,
    		zip_pop3,
    		zip_white1,
    		zip_white2,
    		zip_white3,
    		zip_black1,
    		zip_black2,
    		zip_black3,
    		zip_asian1,
    		zip_asian2,
    		zip_asian3,
    		zip_indian1,
    		zip_indian2,
    		zip_indian3,
    		zip_data,
    		handleOptionSelect,
    		onMount,
    		csv,
    		fetchData,
    		handleZIPChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(17, options = $$props.options);
    		if ('option1' in $$props) $$invalidate(0, option1 = $$props.option1);
    		if ('option2' in $$props) $$invalidate(1, option2 = $$props.option2);
    		if ('option3' in $$props) $$invalidate(2, option3 = $$props.option3);
    		if ('selectedZIP1' in $$props) selectedZIP1 = $$props.selectedZIP1;
    		if ('selectedZIP2' in $$props) selectedZIP2 = $$props.selectedZIP2;
    		if ('selectedZIP3' in $$props) selectedZIP3 = $$props.selectedZIP3;
    		if ('zip_pop1' in $$props) zip_pop1 = $$props.zip_pop1;
    		if ('zip_pop2' in $$props) $$invalidate(3, zip_pop2 = $$props.zip_pop2);
    		if ('zip_pop3' in $$props) $$invalidate(4, zip_pop3 = $$props.zip_pop3);
    		if ('zip_white1' in $$props) $$invalidate(5, zip_white1 = $$props.zip_white1);
    		if ('zip_white2' in $$props) $$invalidate(6, zip_white2 = $$props.zip_white2);
    		if ('zip_white3' in $$props) $$invalidate(7, zip_white3 = $$props.zip_white3);
    		if ('zip_black1' in $$props) $$invalidate(8, zip_black1 = $$props.zip_black1);
    		if ('zip_black2' in $$props) $$invalidate(9, zip_black2 = $$props.zip_black2);
    		if ('zip_black3' in $$props) $$invalidate(10, zip_black3 = $$props.zip_black3);
    		if ('zip_asian1' in $$props) $$invalidate(11, zip_asian1 = $$props.zip_asian1);
    		if ('zip_asian2' in $$props) $$invalidate(12, zip_asian2 = $$props.zip_asian2);
    		if ('zip_asian3' in $$props) $$invalidate(13, zip_asian3 = $$props.zip_asian3);
    		if ('zip_indian1' in $$props) $$invalidate(14, zip_indian1 = $$props.zip_indian1);
    		if ('zip_indian2' in $$props) $$invalidate(15, zip_indian2 = $$props.zip_indian2);
    		if ('zip_indian3' in $$props) $$invalidate(16, zip_indian3 = $$props.zip_indian3);
    		if ('zip_data' in $$props) zip_data = $$props.zip_data;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		option1,
    		option2,
    		option3,
    		zip_pop2,
    		zip_pop3,
    		zip_white1,
    		zip_white2,
    		zip_white3,
    		zip_black1,
    		zip_black2,
    		zip_black3,
    		zip_asian1,
    		zip_asian2,
    		zip_asian3,
    		zip_indian1,
    		zip_indian2,
    		zip_indian3,
    		options,
    		handleZIPChange,
    		select0_change_handler,
    		change_handler,
    		select1_change_handler,
    		change_handler_1,
    		select2_change_handler,
    		change_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
