update public.products
set shop_visible = false,
    is_featured = false,
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'reviewStatus', 'removed',
      'hiddenReason', 'Gift-card-like listing removed from visible shop items'
    )
where slug = 'cerannic-porcel-na-pl-ksn-te';

update public.products
set shop_visible = true,
    is_featured = true,
    shop_rank = 1
where slug = 'cerannic-amanda';
