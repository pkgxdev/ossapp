<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
  import type { ListActionItem } from '@tea/ui/types';
	import ListAction from '@tea/ui/list-action/list-action.svelte';

  const action_label = $t("script.use-label");
  const items: ListActionItem[] = [
    {
      title: 'Script A',
      sub_title: 'v 0.0.1',
      image_url: '/images/bored-ape.png',
      action_label
    },
    {
      title: 'Script B',
      sub_title: 'v 0.1.1',
      image_url: '/images/bored-ape.png',
      action_label
    },
    {
      title: 'Script C',
      sub_title: 'v 2.0.1',
      image_url: '/images/bored-ape.png',
      action_label
    },
    {
      title: 'Script D',
      sub_title: 'v 0.1.1',
      image_url: '/images/bored-ape.png',
      action_label
    },
    {
      title: 'Script E',
      sub_title: 'v 0.1.1',
      image_url: '/images/bored-ape.png',
      action_label
    },
  ];
</script>


<ListAction
  title={$t("script.top-list-title")}
  mainCtaTitle={$t("script.view-all-cta").toUpperCase()}
  items={items}
  onSelectItem={async (script) => {
    console.log(script)
  }}
/>