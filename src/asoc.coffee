Memory = () ->

	this.lengths = {}
	this.data = {}
	self = this

	# Handle low-level connecting.
	this.subLink = (a, b, strength) ->
		if self.data[a]
			self.lengths[a] += 1
			self.data[a][b] = strength
		else
			self.data[a] = {}
			self.lengths[a] = 0
			self.subLink(a, b, strength)

	# Interconnect two words.
	this.link = (a, b, strength) ->
		self.subLink a, b, strength
		self.subLink b, a, strength

	this.links = (ls) ->
		for x in ls
			self.link x[0], x[1], x[2]

	# Calculates a memory that holds the strengths
	# at the current state.
	# Returns a memory that can be operated on to for example
	# find the most fired association.
	this.calculate = (clues, power, min) ->

		tmps = []

		self._min = min || 0.01

		for clue in clues
			temporary = {}
			temporary[clue] = power || 1
			self.asoc temporary, null, clue
			tmps.push temporary

		res = {}

		for t in tmps
			for a of t
				if res[a]
					res[a] += t[a]
				else res[a] = t[a]

		return res


	# Develop a calcuated memory, that holds the strength
	# at the current state.
	this.asoc = (temp, origin, current) ->
		if origin == null
			for a of self.data[current]
				self.asoc temp, current, a
		else
			common = self.getCommon origin, current
			link = self.data[origin][current]
			cprod = temp[origin]

			sum = 0
			for x in common
				xtra = temp[origin] * self.data[x][origin]
				sum += (xtra + (temp[x] || 0)) * self.data[x][current]

			inc = sum + link * cprod

			if inc >= self._min
				temp[current] = if temp[current] then temp[current] else 0
				temp[current] += inc
				for a of self.data[current]
					unless a == origin 
						unless a in common
							self.asoc temp, current, a


	# Used to gather common links to calculate
	# common factor.
	this.getCommon = (origin, current) ->
		holder = {}
		for a of self.data[origin]
			holder[a] = 1
		for b of self.data[current]
			if holder[b]
				holder[b] += 1
		res = []
		for c of holder
			if holder[c] == 2
				res.push c

		return res

	return this


test = new Memory

test.links [ 
		["cow", "milk", 0.5],
		["cow", "animal", 0.5],
		["milk", "drink", 0.5],
		["milk", "white", 0.2],
		["drink", "white", 0.01],
		["4", "animal", 0.05],
		["leggs", "animal", 0.05],
		["4", "leggs", 0.2],
		["water", "drink", 0.5]
	]

window.main = () ->
	res = test.calculate ["drink", "white"], 1, 0.05
	sortable = []
	for a of res
		sortable.push [a, res[a]]
	
	for a in (sortable.sort (a,b) -> b[1] - a[1])
		node = document.createElement('li')
		node.appendChild document.createTextNode("#{a[0]}: #{a[1]}")
		document.getElementById('super-list').appendChild(node)