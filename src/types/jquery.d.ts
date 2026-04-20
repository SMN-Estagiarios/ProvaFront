interface JQuery { 
    floatingScroll(): JQuery;
    sortable(): JQuery;
    mask(pattern: string, options?: any): JQuery;
    tree(): JQuery;
}

interface JQueryStatic {
    postFormData(url: string, formData: FormData): JQuery.jqXHR<any>;
}
