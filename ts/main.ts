const rules: { [name: string]: Rule; } = {
	"alphabet": new Rule("", "", new RSelect([
		new Rule("DNA", "DNA"),
		new Rule("RNA", "RNA"),
		new Rule("Protein", "Protein"),
		new Rule("Binary", "Binary"),
		new Rule("Word", "Word", new RObj([
			new Rule("Letter", "letter", new RSelect([
				new Rule("DNA", "DNA"),
				new Rule("RNA", "RNA"),
				new Rule("Protein", "Protein"),
			])),
			new Rule("Length", "length", new RInteger(1)),
		])),
		new Rule("Codon", "Codon", new RObj([
			new Rule("Letter", "letter", new RSelect([
				new Rule("DNA", "DNA"),
				new Rule("RNA", "RNA"),
			])),
		])),
	])),
	"seq": new Rule("seq", "seq", new RSelect([
		new Rule("Fasta", "Fasta", new RFileObj([
			new Rule("extended", "extended", new RBool()),
			new Rule("strictNames", "strictNames", new RBool()),
		])),
		new Rule("Mase", "Mase", new RFileObj([
			new Rule("siteSelection", "siteSelection", new RBool(true)),
		])),
		new Rule("Phylip", "Phylip", new RFileObj([
			new Rule("order", "order", new RSelect([
				new Rule("interleaved", "interleaved"),
				new Rule("sequential", "sequential"),
			])),
			new Rule("type", "type", new RSelect([
				new Rule("classic", "classic"),
				new Rule("extended", "extended"),
			])),
			new Rule("split", "split", new RSelect([
				new Rule("spaces", "spaces"),
				new Rule("tab", "tab"),
			])),
		])),
		new Rule("Clustal", "Clustal", new RFileObj([
			new Rule("extraSpaces", "extraSpaces", new RBool()),
		])),
		new Rule("Dcse", "Dcse", new RFileObj([])),
		new Rule("Nexus", "Nexus", new RFileObj([])),
		new Rule("Genbank", "Genbank", new RFileObj([])),
	])),
	"tree": new Rule("tree", "tree", new RSelect([
		new Rule("Newick", "Newick", new RFileObj([])),
		new Rule("Nexus", "Nexus", new RFileObj([])),
		new Rule("NHX", "NHX", new RFileObj([])),
	])),
	"model": new Rule("model", "model", new RObj([
		new Rule("JC69", "JC69", new RObj([])),
		new Rule("K80", "K80", new RObj([
			new Rule("kappa", "kappa", new RFloat()),
		])),
		new Rule("F84", "F84", new RObj([
			new Rule("kappa", "kappa", new RFloat()),
			new Rule("theta", "theta", new RFloat()),
			new Rule("theta1", "theta_1", new RFloat()),
			new Rule("theta2", "theta_2", new RFloat()),
		])),
		new Rule("HKY85", "HKY85", new RObj([
			new Rule("kappa", "kappa", new RFloat()),
			new Rule("theta", "theta", new RFloat()),
			new Rule("theta1", "theta_1", new RFloat()),
			new Rule("theta2", "theta_2", new RFloat()),
		])),
		new Rule("T92", "T92", new RObj([
			new Rule("kappa", "kappa", new RFloat()),
			new Rule("theta", "theta", new RFloat()),
		])),
		new Rule("TN93", "TN93", new RObj([
			new Rule("kappa1", "kappa_1", new RFloat()),
			new Rule("kappa2", "kappa_2", new RFloat()),
			new Rule("theta", "theta", new RFloat()),
			new Rule("theta1", "theta_1", new RFloat()),
			new Rule("theta2", "theta_2", new RFloat()),
		])),
	])),
	"root": new Rule("root", "root", new RObj([
	])),
	"rate": new Rule("rate", "rate", new RObj([
	])),
	"proc": new Rule("proc", "proc", new RObj([
	])),
	"phyl": new Rule("phyl", "phyl", new RObj([
	])),
};
const options: { [name: string]: BppOpt; } = {
	"alphabet": new BppOpt("alphabet", () => {
		options["seq"].nuke();
	}),
	"seq": new BppOpt("seq"),
	"tree": new BppOpt("tree"),
	"model": new BppOpt("model"),
	"root": new BppOpt("root"),
	"rate": new BppOpt("rate"),
	"proc": new BppOpt("proc"),
	"phyl": new BppOpt("phyl"),
};
let files: { [index: string]: HTMLInputElement } = {};

registersubmit();
