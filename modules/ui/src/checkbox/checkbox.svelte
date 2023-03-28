<script lang="ts">
	export let label: string;
	export let checked: boolean;
</script>

<label class="flex justify-between text-sm">
	<div>{label}</div>
	<div class="checkbox">
		<input type="checkbox" bind:checked />
		<span class="checkmark" />
	</div>
</label>

<style>
	label {
		position: relative;
		cursor: auto;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	/* Hide the browser's default checkbox */
	label .checkbox {
		position: relative;
		width: 25px;
		height: 25px;
	}
	label input {
		opacity: 0;
		cursor: auto;
		height: 0;
		width: 0;
	}

	/* Create a custom checkbox */
	.checkmark {
		position: absolute;
		top: 2px;
		left: 0;
		height: 14px;
		width: 14px;
		background-color: #eee;
	}

	/* On mouse-over, add a grey background color */
	label:hover input ~ .checkmark {
		background-color: #ccc;
	}

	/* When the checkbox is checked, add a blue background */
	label input:checked ~ .checkmark {
		background-color: #00ffd0;
	}

	/* Create the checkmark/indicator (hidden when not checked) */
	.checkmark:after {
		content: "";
		position: absolute;
		display: none;
	}

	/* Show the checkmark when checked */
	label input:checked ~ .checkmark:after {
		display: block;
	}

	/* Style the checkmark/indicator */
	label .checkmark:after {
		left: 5px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 3px 3px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
</style>
