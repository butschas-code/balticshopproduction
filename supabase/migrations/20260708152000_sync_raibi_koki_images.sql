-- Sync Raibi Koki local product images
begin;

update public.partners set portrait_url = '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-01.png', workshop_images = '["/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-01.png", "/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-01.png", "/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-01.png"]'::jsonb where slug = 'raibi-koki';
update public.artisans set portrait_url = '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-01.png', workshop_images = '["/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-01.png", "/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-01.png", "/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-01.png"]'::jsonb where slug = 'raibi-koki';

update public.products set image_url = '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-01.png', price_amount = 162.00 where slug = 'raibi-koki-lielais-raibis-43x27-cm';
delete from public.product_images where product_id in (select id from public.products where slug = 'raibi-koki-lielais-raibis-43x27-cm');
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-01.png', 0 from public.products pr where pr.slug = 'raibi-koki-lielais-raibis-43x27-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-02.png', 1 from public.products pr where pr.slug = 'raibi-koki-lielais-raibis-43x27-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-03.png', 2 from public.products pr where pr.slug = 'raibi-koki-lielais-raibis-43x27-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-04.png', 3 from public.products pr where pr.slug = 'raibi-koki-lielais-raibis-43x27-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-05.png', 4 from public.products pr where pr.slug = 'raibi-koki-lielais-raibis-43x27-cm';

update public.products set image_url = '/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-01.png', price_amount = 60.00 where slug = 'raibi-koki-triskasu-32x23-cm';
delete from public.product_images where product_id in (select id from public.products where slug = 'raibi-koki-triskasu-32x23-cm');
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-01.png', 0 from public.products pr where pr.slug = 'raibi-koki-triskasu-32x23-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-02.png', 1 from public.products pr where pr.slug = 'raibi-koki-triskasu-32x23-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-03.png', 2 from public.products pr where pr.slug = 'raibi-koki-triskasu-32x23-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-04.png', 3 from public.products pr where pr.slug = 'raibi-koki-triskasu-32x23-cm';

update public.products set image_url = '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-01.png', price_amount = 126.00 where slug = 'raibi-koki-triskrasu-40x26-cm';
delete from public.product_images where product_id in (select id from public.products where slug = 'raibi-koki-triskrasu-40x26-cm');
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-01.png', 0 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02.png', 1 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-03.png', 2 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-04.png', 3 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-05.png', 4 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm';

update public.products set image_url = '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-01.png', price_amount = 126.00 where slug = 'raibi-koki-triskrasu-40x26-cm-02';
delete from public.product_images where product_id in (select id from public.products where slug = 'raibi-koki-triskrasu-40x26-cm-02');
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-01.png', 0 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm-02';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-02.png', 1 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm-02';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-03.png', 2 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm-02';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-04.png', 3 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm-02';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-05.png', 4 from public.products pr where pr.slug = 'raibi-koki-triskrasu-40x26-cm-02';

update public.products set image_url = '/partners/raibi-koki/images/raibi-koki-galda-sp-le-marble-solitaire-01.png', price_amount = 48.00 where slug = 'raibi-koki-galda-sp-le-marble-solitaire';
delete from public.product_images where product_id in (select id from public.products where slug = 'raibi-koki-galda-sp-le-marble-solitaire');
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-galda-sp-le-marble-solitaire-01.png', 0 from public.products pr where pr.slug = 'raibi-koki-galda-sp-le-marble-solitaire';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-galda-sp-le-marble-solitaire-02.png', 1 from public.products pr where pr.slug = 'raibi-koki-galda-sp-le-marble-solitaire';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-galda-sp-le-marble-solitaire-03.png', 2 from public.products pr where pr.slug = 'raibi-koki-galda-sp-le-marble-solitaire';
insert into public.product_images (product_id, image_url, position) select pr.id, '/partners/raibi-koki/images/raibi-koki-galda-sp-le-marble-solitaire-04.png', 3 from public.products pr where pr.slug = 'raibi-koki-galda-sp-le-marble-solitaire';

commit;
