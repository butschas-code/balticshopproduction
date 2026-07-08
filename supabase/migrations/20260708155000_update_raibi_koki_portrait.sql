begin;
update public.partners set portrait_url = '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-03.png', workshop_images = '["/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-01.png", "/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-01.png"]'::jsonb where slug = 'raibi-koki';
update public.artisans set portrait_url = '/partners/raibi-koki/images/raibi-koki-lielais-raibis-43x27-cm-03.png', workshop_images = '["/partners/raibi-koki/images/raibi-koki-triskasu-32x23-cm-01.png", "/partners/raibi-koki/images/raibi-koki-triskrasu-40x26-cm-02-01.png"]'::jsonb where slug = 'raibi-koki';
commit;
