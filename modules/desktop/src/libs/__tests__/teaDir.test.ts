import { getPkgBottles } from "../teaDir";

describe("teaDir module", () => {
	it("should getPkgBottles from nested Dir object/s", () => {
		const results = getPkgBottles({
			name: "kkos",
			path: "/Users/x/.tea/github.com/kkos",
			children: [
				{ name: ".DS_Store", path: "/Users/x/.tea/github.com/kkos/.DS_Store" },
				{
					name: "oniguruma",
					path: "/Users/x/.tea/github.com/kkos/oniguruma",
					children: [
						{ name: ".DS_Store", path: "/Users/x/.tea/github.com/kkos/oniguruma/.DS_Store" },
						{
							path: "/Users/x/.tea/github.com/kkos/oniguruma/v6",
							name: "v6",
							children: [
								{ name: ".DS_Store", path: "/Users/x/.tea/github.com/kkos/oniguruma/v6/.DS_Store" }
							]
						},
						{
							name: "v*",
							path: "/Users/x/.tea/github.com/kkos/oniguruma/v*",
							children: []
						},
						{
							name: "v6.9.8",
							path: "/Users/x/.tea/github.com/kkos/oniguruma/v6.9.8",
							children: []
						},
						{
							name: "v6.9",
							path: "/Users/x/.tea/github.com/kkos/oniguruma/v6.9",
							children: []
						}
					]
				}
			]
		});

		expect(results).toEqual([
			"github.com/kkos/oniguruma/v*",
			"github.com/kkos/oniguruma/v6",
			"github.com/kkos/oniguruma/v6.9",
			"github.com/kkos/oniguruma/v6.9.8"
		]);
	});
});
