<script lang="ts">
  import Button from '@tea/ui/Button/Button.svelte';
	import { open } from '@tauri-apps/api/shell';
  import { getDeviceAuth } from '@api';

  const authPage = 'http://localhost:3000/v1'; // https://api.tea.xyz/v1/auth/user?device_id=device_id

  let statusMessage = '';

  let timer: NodeJS.Timer;

  let loop = 0;

	const openGithub = () => {
		open(authPage);
		try {
      if (!timer) {
        timer = setInterval(pollAuth, 5000)
      } 
		} catch (error) {
			console.error(error);
		}
	};

  const pollAuth = async () => {
    loop++;
    try {
      const data = await getDeviceAuth();
      console.log('dd:',data);
      if (data.status === 'SUCCESS') {
        clearInterval(timer);
      }
      statusMessage = data.status;
    } catch (error) {
      console.error(error);
    }

    if (loop > 20 && timer) {
      clearInterval(timer);
      loop = 0;
    }
  }
</script>

<p>{loop}:{statusMessage}</p>
<Button onClick={openGithub}>login</Button>