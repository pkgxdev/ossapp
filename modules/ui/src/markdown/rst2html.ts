// this was directly taken from https://github.com/thoward/rst2html
// sorry no time to make a pr to the module there
// added a render_directive fn
import restructured from "restructured";

const rst2html = (rstSource): string => {
	const parsedRST = restructured.parse(rstSource);
	const html = render_any(parsedRST, 0, 2);
	return html;
};

export default rst2html;

const render_any = (element, level = 0, indent = 2) => {
	switch (element.type) {
		case "document":
			return render_document(element, level, indent);
		case "section":
			return render_section(element, level, indent);
		case "transition":
			return render_transition(element, level, indent);
		case "paragraph":
			return render_paragraph(element, level, indent);
		case "bullet_list":
			return render_bullet_list(element, level, indent);
		case "enumerated_list":
			return render_enumerated_list(element, level, indent);
		case "definition_list":
			return render_definition_list(element, level, indent);
		case "list_item":
			return render_list_item(element, level, indent);
		case "line":
			return render_line(element, level, indent);
		case "line_block":
			return render_line_block(element, level, indent);
		case "literal_block":
			return render_literal_block(element, level, indent);
		case "block_quote":
			return render_block_quote(element, level, indent);
		case "interpreted_text":
			return render_interpreted_text(element, level, indent);
		case "text":
			return render_text(element, level, indent);
		case "emphasis":
			return render_emphasis(element, level, indent);
		case "strong":
			return render_strong(element, level, indent);
		case "literal":
			return render_literal(element, level, indent);
		case "directive":
			return render_directive(element, level, indent);
		default:
			return render_unknown(element, level, indent);
	}
};

const render_unknown = (element, level = 0, indent = 2) => {
	if (element.children) {
		return render_block_element("div", `rst-unknown rst-${element.type}`, element, level, indent);
	} else {
		return render_leaf_element("div", `rst-unknown rst-${element.type}`, element, level, indent);
	}
};

const render_document = (element, level = 0, indent = 2) => {
	return render_block_element("div", "rst-document", element, level, indent);
};

const render_section = (element, level = 0, indent = 2) => {
	const indentString = " ".repeat(level * indent);

	const title = render_title(element.depth, element.children[0], level + 1, indent);

	const children = element.children
		.slice(1)
		.map((e) => render_any(e, level + 1, indent))
		.join("\n");

	return `${indentString}<div class="rst-section">\n${title}${children}${indentString}</div>\n`;
};

const render_title = (depth, element, level = 0, indent = 2) => {
	const titleTag = `h${depth}`;
	const titleClassName = `rst-title-${depth}`;

	return render_block_element(titleTag, titleClassName, element, level, indent);
};

const render_transition = (element, level = 0, indent = 2) => {
	// TODO: implement transitions
	return render_unknown(element, level, indent);
};

const render_paragraph = (element, level = 0, indent = 2) => {
	return render_block_element("p", "rst-paragraph", element, level, indent);
};

const render_bullet_list = (element, level = 0, indent = 2) => {
	return render_block_element("ul", "rst-bullet-list", element, level, indent);
};

const render_enumerated_list = (element, level = 0, indent = 2) => {
	return render_block_element("ol", "rst-enumerated-list", element, level, indent);
};

const render_definition_list = (element, level = 0, indent = 2) => {
	// TODO: implement definition lists
	return render_unknown(element, level, indent);
};

const render_list_item = (element, level = 0, indent = 2) => {
	return render_block_element("li", "rst-list-item", element, level, indent);
};

const render_line = (element, level = 0, indent = 2) => {
	return render_block_element("div", "rst-line", element, level, indent);
};

const render_line_block = (element, level = 0, indent = 2) => {
	return render_block_element("div", "rst-line-block", element, level, indent);
};

const render_literal_block = (element, level = 0, indent = 2) => {
	return render_block_element("pre", "rst-literal-block", element, level, indent);
};

const render_block_quote = (element, level = 0, indent = 2) => {
	return render_block_element("blockquote", "rst-block-quote", element, level, indent);
};

const render_text = (element, level = 0, indent = 2) => {
	return render_leaf_element("span", "rst-text", element, level, indent);
};

const render_interpreted_text = (element, level = 0, indent = 2) => {
	const className = "rst-interpreted_text" + (element.role ? ` rst-role-${element.role}` : "");
	return render_inline_element("span", className, element, level, indent);
};

const render_emphasis = (element, level = 0, indent = 2) => {
	return render_inline_element("em", "rst-emphasis", element, level, indent);
};

const render_strong = (element, level = 0, indent = 2) => {
	return render_inline_element("strong", "rst-strong", element, level, indent);
};

const render_literal = (element, level = 0, indent = 2) => {
	return render_inline_element("tt", "rst-literal", element, level, indent);
};

const render_leaf_element = (tag, className, element, level = 0, indent = 2) => {
	const indentString = " ".repeat(level * indent);
	return `<${tag} class="${className}">${element.value.replace(/\n$/, "")}</${tag}>`;
};

const render_inline_element = (tag, className, element, level = 0, indent = 2) => {
	const children = element.children.map((e) => render_any(e, level + 1, indent)).join("");
	return `<${tag} class="${className}">${children}</${tag}>`;
};

const render_block_element = (tag, className, element, level = 0, indent = 2) => {
	const indentString = " ".repeat(level * indent);
	const children = element.children.map((e) => render_any(e, level + 1, indent)).join("");

	return `${indentString}<${tag} class="${className}">\n${children}\n${indentString}</${tag}>\n`;
};

const render_directive = (element, level = 0, indent = 2) => {
	const indentString = " ".repeat(level * indent);
	const src = element.children[0].value;
	const alt = element.children[1].value;
	return element.directive === "image"
		? `
  ${indentString}<img src="${src}" alt="${alt}" />\n
  `
		: "";
};
