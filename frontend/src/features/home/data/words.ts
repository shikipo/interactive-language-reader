// Sample Structure of words extracted from a PDF document
// (just for demo, in real case its more complex)

interface Word {
	id: number
	page: number  // pages
	text: string  // word text
	x: number     // left padding in pt
	y: number     // right padding in pt
	w: number     // width of the word in pt
	h: number     // height of the word in pt
}

export const words: Word[] = [
	// Sentence 1: "Hello world this is a test"
	{ id: 1,  page: 1, text: 'Hello', x: 56,  y: 750, w: 35, h: 14 },
	{ id: 2,  page: 1, text: 'world', x: 96,  y: 750, w: 35, h: 14 },
	{ id: 3,  page: 1, text: 'this',  x: 136, y: 750, w: 28, h: 14 },
	{ id: 4,  page: 1, text: 'is',    x: 169, y: 750, w: 14, h: 14 },
	{ id: 5,  page: 1, text: 'a',     x: 188, y: 750, w: 7,  h: 14 },
	{ id: 6,  page: 1, text: 'test',  x: 200, y: 750, w: 28, h: 14 },

	// Sentence 2: "The document shows some words"
	{ id: 7,  page: 1, text: 'The',      x: 56,  y: 730, w: 21, h: 14 },
	{ id: 8,  page: 1, text: 'document', x: 82,  y: 730, w: 56, h: 14 },
	{ id: 9,  page: 1, text: 'shows',    x: 143, y: 730, w: 35, h: 14 },
	{ id: 10, page: 1, text: 'some',     x: 183, y: 730, w: 28, h: 14 },
	{ id: 11, page: 1, text: 'words',    x: 216, y: 730, w: 35, h: 14 },
]
