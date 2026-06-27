import { memo } from 'react';
import headerS from './headerS.module.scss';

function Header() {
  return (
    <>
      <h1 className={headerS.heading}>
        <span>Визуализация модели Лотки–Вольтерры</span>
        <span className={headerS.text__additional}>Временной ряд и Фазовый портрет</span>
      </h1>
    </>
  );
}
export default memo(Header);
