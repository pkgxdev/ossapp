export const nameToSlug = (name: string) => {
	// github.com/Pypa/twine -> github_com_pypa_twine
	const slug = name.replace(/[^\w\s]/gi, "_").toLocaleLowerCase();
	return slug;
};
