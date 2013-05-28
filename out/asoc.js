(function() {
  var Memory, test,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Memory = function() {
    var self;

    this.lengths = {};
    this.data = {};
    self = this;
    this.subLink = function(a, b, strength) {
      if (self.data[a]) {
        self.lengths[a] += 1;
        return self.data[a][b] = strength;
      } else {
        self.data[a] = {};
        self.lengths[a] = 0;
        return self.subLink(a, b, strength);
      }
    };
    this.link = function(a, b, strength) {
      self.subLink(a, b, strength);
      return self.subLink(b, a, strength);
    };
    this.links = function(ls) {
      var x, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = ls.length; _i < _len; _i++) {
        x = ls[_i];
        _results.push(self.link(x[0], x[1], x[2]));
      }
      return _results;
    };
    this.calculate = function(clues, power, min) {
      var a, clue, res, t, temporary, tmps, _i, _j, _len, _len1;

      tmps = [];
      self._min = min || 0.01;
      for (_i = 0, _len = clues.length; _i < _len; _i++) {
        clue = clues[_i];
        temporary = {};
        temporary[clue] = power || 1;
        self.asoc(temporary, null, clue);
        tmps.push(temporary);
      }
      res = {};
      for (_j = 0, _len1 = tmps.length; _j < _len1; _j++) {
        t = tmps[_j];
        for (a in t) {
          if (res[a]) {
            res[a] += t[a];
          } else {
            res[a] = t[a];
          }
        }
      }
      return res;
    };
    this.asoc = function(temp, origin, current) {
      var a, common, cprod, inc, link, sum, x, xtra, _i, _len, _results, _results1;

      if (origin === null) {
        _results = [];
        for (a in self.data[current]) {
          _results.push(self.asoc(temp, current, a));
        }
        return _results;
      } else {
        common = self.getCommon(origin, current);
        link = self.data[origin][current];
        cprod = temp[origin];
        sum = 0;
        for (_i = 0, _len = common.length; _i < _len; _i++) {
          x = common[_i];
          xtra = temp[origin] * self.data[x][origin];
          sum += (xtra + (temp[x] || 0)) * self.data[x][current];
        }
        inc = sum + link * cprod;
        if (inc >= self._min) {
          temp[current] = temp[current] ? temp[current] : 0;
          temp[current] += inc;
          _results1 = [];
          for (a in self.data[current]) {
            if (a !== origin) {
              if (__indexOf.call(common, a) < 0) {
                _results1.push(self.asoc(temp, current, a));
              } else {
                _results1.push(void 0);
              }
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }
      }
    };
    this.getCommon = function(origin, current) {
      var a, b, c, holder, res;

      holder = {};
      for (a in self.data[origin]) {
        holder[a] = 1;
      }
      for (b in self.data[current]) {
        if (holder[b]) {
          holder[b] += 1;
        }
      }
      res = [];
      for (c in holder) {
        if (holder[c] === 2) {
          res.push(c);
        }
      }
      return res;
    };
    return this;
  };

  test = new Memory;

  test.links([["cow", "milk", 0.5], ["cow", "animal", 0.5], ["milk", "drink", 0.5], ["milk", "white", 0.2], ["drink", "white", 0.01], ["4", "animal", 0.05], ["leggs", "animal", 0.05], ["4", "leggs", 0.2], ["water", "drink", 0.5]]);

  window.main = function() {
    var a, node, res, sortable, _i, _len, _ref, _results;

    res = test.calculate(["drink", "white"], 1, 0.05);
    sortable = [];
    for (a in res) {
      sortable.push([a, res[a]]);
    }
    _ref = sortable.sort(function(a, b) {
      return b[1] - a[1];
    });
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      node = document.createElement('li');
      node.appendChild(document.createTextNode("" + a[0] + ": " + a[1]));
      _results.push(document.getElementById('super-list').appendChild(node));
    }
    return _results;
  };

}).call(this);
