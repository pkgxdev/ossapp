<script lang="ts">
  import { shellOpenExternal, submitLogs } from "@native";
  import LoginButton from "./login-button.svelte";
  import ButtonIcon from "$components/button-icon/button-icon.svelte";
  import SettingsMenu from "$components/settings-menu/settings-menu.svelte";

  const submitBugReport = async () => {
    const logId = await submitLogs();
    const bugFormUrl = `https://airtable.com/shravDxWeNwwpPkFV?prefill_log_id=${logId}&hide_log_id=true`;
    shellOpenExternal(bugFormUrl);
  };
</script>

<div class="mr-1 flex h-full items-center justify-end gap-2 p-2">
  <ButtonIcon icon="bug" helpText="report feedback" on:click={() => submitBugReport()} />
  <SettingsMenu />
  <LoginButton />
</div>
