<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
  import type { ListActionItem } from '@tea/ui/types';
	import ListAction from '@tea/ui/ListAction/ListAction.svelte';

  const items: ListActionItem[] = [
    {
      title: 'Script A',
      sub_title: 'v 0.0.1',
      image_url: '/images/bored-ape.png',
      action_label: 'USE'
    },
    {
      title: 'Script B',
      sub_title: 'v 0.1.1',
      image_url: '/images/bored-ape.png',
      action_label: 'USE'
    },
    {
      title: 'Script C',
      sub_title: 'v 2.0.1',
      image_url: '/images/bored-ape.png',
      action_label: 'USE'
    },
    {
      title: 'Script D',
      sub_title: 'v 0.1.1',
      image_url: '/images/bored-ape.png',
      action_label: 'USE'
    },
    {
      title: 'Script E',
      sub_title: 'v 0.1.1',
      image_url: '/images/bored-ape.png',
      action_label: 'USE'
    },
  ];
</script>


<ListAction
  title="Top scripts this week"
  mainCtaTitle="VIEW ALL SCRIPTS"
  items={items}
  onSelectItem={async (script) => {
    console.log(script)
  }}
/>