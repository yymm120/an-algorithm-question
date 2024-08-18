// start
export class Axis {
  m: number
  n: number
  all_point: [[number, number]]
  total_step: number;
  constructor(m, n) {
    this.m = m;
    this.n = n
    this.total_step = m * n - 1;
    this.all_point = [[0, 0]];
    for (let i = 0; i < n; i++) {
      for (let j = 1; j < m; j++) {
        this.all_point.push([i, j]);
      }
    }
  }
}


export class Point {
  axis: Axis
  destination: [number, number]
  position: [number, number]
  passing_map: {
    [key: string]: {
      position: string,
      available_position: [
        {
          position: [number, number],
          is_destination: boolean,
          choosed: boolean
        }
      ]
    }
  }
  step: number
  done: boolean = false;

  // left / right / bottom / top
  left: [number, number] | undefined
  right: [number, number] | undefined
  bottom: [number, number] | undefined
  top: [number, number] | undefined



  constructor(x, y, axis) {
    if (!axis) {
      return;
    }
    this.axis = axis;
    if (x > axis.n - 1 || y > axis.m - 1) {
      console.log("error in init");
      return;
    }
    this.destination = [axis.n - 1, axis.m - 1];
    this.position = [x, y];
    this.passing_map = {};
    this.step = 0;
    this.init_position(axis.m, axis.n);
    this.init_passing_map();
  }



  // 每次执行go_one_time方法, 都会更新left/right/bottom/top的坐标
  init_position(m, n) {
    const x = this.position[0];
    const y = this.position[1];
    this.left = undefined;
    this.top = undefined;
    this.right = undefined;
    this.bottom = undefined;
    if (x - 1 >= 0) {
      this.left = [x - 1, y];
    }
    if (x + 1 <= n - 1) {
      this.right = [x + 1, y];
    }
    if (y - 1 >= 0) {
      this.bottom = [x, y - 1];
    }
    if (y + 1 <= m - 1) {
      this.top = [x, y + 1];
    }
  }


  // 每次运行go_one_time方法, 都会更新经过的坐标点。
  init_passing_map() {
    let available_position = this.not_in_passing_map([
      this.left,
      this.bottom,
      this.top,
      this.right,
    ]);
    if (!available_position) {
      console.log("error, available_position is empty.");
    }

    this.passing_map[this.step] = {
      position: this.position.toString(),
      available_position: available_position.map((p) => {
        let choosed = false;
        if (this.passing_map[this.step]?.available_position?.length > 0) {
          const state = this.passing_map[this.step].available_position?.filter(s => s.position === p.toString())
          choosed = false || state[0]?.choosed;
        }
        return {
          position: p,
          is_destination: p.toString() === this.destination.toString(),
          choosed,
        };
      })
    }
  }




  /**
   * 检查坐标是否走过一次了
   */
  not_in_passing_map(positions) {
    if (!this.passing_map) {
      return positions;
    }
    const passing_map_values = Object.values(this.passing_map);
    const passing_arr = passing_map_values.map((p) => {
      return (p as any).position;
    })
    const available_position = positions?.filter((p) => {
      if (p && !passing_arr.includes(p.toString())) {
        return p;
      }
    });
    return available_position;
  }



  /**
   * 选择一个坐标, 返回选择的坐标
   */
  choose_position(): { choosed_position: [number, number] | undefined } {
    let choosed_position: [number, number] | undefined = undefined;
    const temp = this.passing_map[this.step]?.available_position?.filter((p) => {
      // 优先选择非终点坐标
      return (p.choosed === false && p.is_destination === false)
        || (p.choosed === false && p.is_destination === true);
    });
    choosed_position = temp[0]?.position;
    return {
      choosed_position
    };
  }



  go_one_time(choosed_position) {
    if (!choosed_position) {
      console.log("choosed_position is ", choosed_position);
      return;
    }
    this.passing_map[this.step].available_position.forEach(p => {
      if (p.position.toString() === choosed_position.toString()) {
        p.choosed = true;
      }
    })
    this.step = this.step + 1;
    this.position = choosed_position;
    this.init_position(this.axis.m, this.axis.n);
    this.init_passing_map()
    return this;
  }



  roll_back() {
    if (this.step <= 0) {
      this.done = true;
      return this;
    }
    delete this.passing_map[this.step]
    this.step = this.step - 1;

    const position = this.passing_map[this.step]?.position;
    this.position = [Number(position[0]), Number(position[2])];
    this.init_position(this.axis.m, this.axis.n);

    return this.passing_map[this.step].available_position.filter(p => p.choosed === false)
      .length === 0 && this.roll_back();
  }

}

export default Point;

