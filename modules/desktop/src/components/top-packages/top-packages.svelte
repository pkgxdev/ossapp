<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import ListAction from '@tea/ui/list-action/list-action.svelte';
  import type { ListActionItem } from '@tea/ui/types';
  import { packagesStore } from '$libs/stores';

  let items: ListActionItem[];

  packagesStore.subscribe((ps) => {
		items = ps
      .filter((p) => (p.categories || []).includes('top_packages'))
      .map((pkg) => ({
        title: pkg.full_name,
        sub_title: pkg.version,
        action_label: 'INSTALL',
        image_url: pkg.thumb_image_url,
        detail_url: `/packages/${pkg.slug}`
      }));
	});

  const onSelectPackage = async (item:ListActionItem) => {
    console.log(item);
  }
</script>

<ListAction
  title="Top packages this week"
  mainCtaTitle="VIEW ALL SCRIPTS"
  items={items}
  onSelectItem={onSelectPackage}
/>