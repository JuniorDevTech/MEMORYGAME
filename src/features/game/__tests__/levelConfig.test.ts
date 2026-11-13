import { getLevelConfig } from "../levelConfig";

describe("NEBULA PATH - Level Configuration", () => {
  it("configure correctement le niveau 1", () => {
    const config = getLevelConfig(1);

    expect(config.grid).toEqual({ rows: 2, columns: 2 });
    expect(config.blueCellsCount).toBe(3);
    expect(config.redCellsCount).toBe(1);
    expect(config.memorizationTime).toBe(6);
    expect(config.selectionTime).toBe(18);
  });

  it("configure correctement le niveau 5", () => {
    const config = getLevelConfig(5);

    expect(config.grid).toEqual({ rows: 6, columns: 6 });
    expect(config.blueCellsCount).toBe(11);
    expect(config.redCellsCount).toBe(25);
    expect(config.memorizationTime).toBe(2);
    expect(config.selectionTime).toBe(10);
  });

  it("respecte le nombre total de cellules pour les niveaux 1 à 5", () => {
    for (let level = 1; level <= 5; level++) {
      const config = getLevelConfig(level);

      const totalCells = config.grid.rows * config.grid.columns;

      expect(config.blueCellsCount + config.redCellsCount).toBe(totalCells);
    }
  });

  it("refuse un niveau inférieur à 1", () => {
    expect(() => getLevelConfig(0)).toThrow();
  });

  it("refuse un niveau non configuré", () => {
    expect(() => getLevelConfig(6)).toThrow();
  });
});
