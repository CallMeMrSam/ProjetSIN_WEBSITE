const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const marked = require('marked');

const renderer = {
    heading(text, level) {
      return `
            <h${level} class="title is-${level}" id="${slugify(text, { lower: true, strict: true })}">
                ${text}
            </h${level}>`;
    }
}

marked.use({ renderer });

const articleSchema = Schema({
    _id: Schema.Types.ObjectId,
    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },

    id: {
        type: String,
        unique: true
    },

    htmlContent: {
        type: String
    }
});

articleSchema.post('validate', async (doc, next) => {
    if (doc.title) {
        doc.id = slugify(doc.title, { lower: true, strict: true })
    }
    if (doc.content) {
        doc.htmlContent = dompurify.sanitize(marked(doc.content))
    }
    next()
  })

module.exports = model("Article", articleSchema);