<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
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
        action_label: $t("package.install-label").toUpperCase(),
        image_url: pkg.thumb_image_url,
        detail_url: `/packages/${pkg.slug}`
      }));
	});

  const onSelectPackage = async (item:ListActionItem) => {
    console.log(item);
  }
</script>

<ListAction
  title={$t("package.top-list-title")}
  mainCtaTitle={$t("package.view-all-cta").toUpperCase()}
  items={items}
  onSelectItem={onSelectPackage}
/>