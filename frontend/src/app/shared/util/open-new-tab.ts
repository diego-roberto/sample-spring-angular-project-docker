export const openNewTab = (URL: string) => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = URL;
    link.click();
}