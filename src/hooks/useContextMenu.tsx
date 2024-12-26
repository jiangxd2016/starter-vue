const ContextMenu = function (options) {
  let instance;

  function createMenu() {
    const ul = document.createElement('ul');
    ul.classList.add('custom-context-menu');
    if (options && options.length > 0) {
      for (const menu of options) {
        const li = document.createElement('li');
        li.textContent = menu.name;
        li.onclick = menu.onClick;
        ul.appendChild(li);
      }
    }
    const body = document.querySelector('body')!;
    body.appendChild(ul);
    return ul;
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createMenu();
      }
      return instance;
    },
  };
};
export function useContextMenu(option: { name: string; onClick: () => void }[] = []) {
  const contextMenu = ContextMenu(option);

  function showMenu(e) {
    e.preventDefault();
    const menus = contextMenu.getInstance();
    menus.style.top = `${e.clientY}px`;
    menus.style.left = `${e.clientX}px`;
    menus.classList.remove('hidden');
  }

  function hideMenu() {
    const menus = contextMenu.getInstance();
    menus.classList.add('hidden');
  }

  document.addEventListener('click', hideMenu);

  return {
    showMenu,
    hideMenu,
  };
}
