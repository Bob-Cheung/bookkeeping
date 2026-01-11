import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SelectTime from './selectTime';

const Keyboard = (props) => {
	// 金额显示状态
	const [amount, setAmount] = useState("0.00");
	// 当前输入的值
	const [currentValue, setCurrentValue] = useState("0");
	// 存储的第一个操作数
	const [firstOperand, setFirstOperand] = useState(null);
	// 存储的运算符
	const [operator, setOperator] = useState(null);
	// 是否等待下一个数字输入
	const [waitingForOperand, setWaitingForOperand] = useState(false);
	// 是否显示等号按钮（有操作符时才显示）
	const [showEquals, setShowEquals] = useState(false);
	// 是否显示日期选择器
	const [openSelectTime, setOpenSelectTime] = useState(false);

	// 处理数字按钮点击
	const handleNumberClick = (digit) => {
		if (waitingForOperand) {
			// 如果等待操作数，开始新的数字输入
			setCurrentValue(digit);
			setAmount(prev => prev + digit);
			setWaitingForOperand(false);
			setShowEquals(true); // 输入第二个操作数后显示等号
		} else {
			// 正常追加数字
			if (currentValue === "0") {
				setCurrentValue(digit);
				setAmount(digit);
			} else {
				const newValue = currentValue + digit;
				setCurrentValue(newValue);
				setAmount(prev => {
					// 如果当前显示的是纯数字，替换为新的完整数字
					if (!isNaN(prev) || prev.endsWith(" ")) {
						return newValue;
					}
					return prev + digit;
				});
			}
		}
	};

	// 处理操作符按钮点击
	const handleOperatorClick = (op) => {
		if (operator && !waitingForOperand) {
			// 如果已经有一个操作符并且有当前值，先计算之前的结果
			const result = performCalculation();
			setFirstOperand(result);
			setAmount(result + ` ${op} `);
			setCurrentValue(result.toString());
			setOperator(op);
			setWaitingForOperand(true);
			setShowEquals(false); // 刚设置新操作符时不显示等号
		} else {
			// 正常设置操作符
			setFirstOperand(parseFloat(currentValue));
			setOperator(op);
			setAmount(prev => {
				// 如果已经是表达式的一部分，替换最后一个操作符
				if (prev.includes(" + ") || prev.includes(" - ")) {
					const parts = prev.split(" ");
					parts[parts.length - 2] = op;
					return parts.join(" ");
				}
				return prev + ` ${op} `;
			});
			setWaitingForOperand(true);
			setShowEquals(false); // 刚设置操作符时不显示等号
		}
	};

	// 执行计算
	const performCalculation = () => {
		const secondOperand = parseFloat(currentValue);
		let result = 0;

		switch (operator) {
			case '+':
				result = firstOperand + secondOperand;
				break;
			case '-':
				result = firstOperand - secondOperand;
				break;
			default:
				return secondOperand;
		}

		// 保留两位小数
		result = Math.round(result * 100) / 100;
		return result;
	};

	// 处理等号按钮点击
	const handleEqualsClick = () => {
		if (operator && !waitingForOperand) {
			const result = performCalculation();
			setAmount(result.toString());
			setCurrentValue(result.toString());
			setOperator(null);
			setFirstOperand(null);
			setWaitingForOperand(false);
			setShowEquals(false); // 计算完成后隐藏等号，显示完成
		}
	};

	// 处理完成按钮点击
	const handleCompleteClick = () => {
		let finalAmount = amount;

		// 如果当前是表达式（如 "6 +" 或 "6 -"），只取第一个操作数
		if (operator && waitingForOperand) {
			// 有操作符但还没有输入第二个操作数，使用第一个操作数
			finalAmount = firstOperand.toString();
		} else if (operator && !waitingForOperand) {
			// 有完整的表达式但没有点击等号，先计算
			const result = performCalculation();
			finalAmount = result.toString();
		} else {
			// 处理纯数字，移除末尾的小数点
			finalAmount = currentValue.replace(/\.$/, '');
			// 如果结果是空字符串，则设为0
			if (finalAmount === '') {
				finalAmount = '0';
			}
		}

		// 处理金额格式，确保有两位小数
		let formattedAmount = finalAmount;
		if (!formattedAmount.includes('.')) {
			formattedAmount = formattedAmount + '.00';
		} else {
			const decimalParts = formattedAmount.split('.');
			if (decimalParts[1].length === 1) {
				formattedAmount = formattedAmount + '0';
			} else if (decimalParts[1].length === 0) {
				formattedAmount = decimalParts[0] + '.00';
			}
		}

		console.log(`完成操作，最终金额: ${formattedAmount}`);

		// 这里可以添加提交或其他业务逻辑，将formattedAmount传递给父组件等

		// 重置计算器
		resetCalculator();
	};

	// 处理小数点按钮
	const handleDecimalClick = () => {
		if (waitingForOperand) {
			setCurrentValue("0.");
			setAmount(prev => prev + "0.");
			setWaitingForOperand(false);
			setShowEquals(true); // 输入小数点后显示等号
		} else if (!currentValue.includes(".")) {
			const newValue = currentValue + ".";
			setCurrentValue(newValue);
			setAmount(prev => {
				if (!isNaN(prev) || prev.endsWith(" ")) {
					return newValue;
				}
				return prev + ".";
			});
		}
	};

	// 处理删除按钮
	const handleDeleteClick = () => {
		// 如果当前是表达式（如 "9 + 9"）
		if (operator && !waitingForOperand && currentValue.length > 0) {
			// 情况1：删除第二个操作数的最后一个字符
			if (currentValue.length > 1) {
				const newValue = currentValue.slice(0, -1);
				setCurrentValue(newValue);
				setAmount(prev => {
					// 删除最后一个字符
					return prev.slice(0, -1);
				});
			}
			// 情况2：删除到只剩操作符（如 "9 + "）
			else if (currentValue.length === 1) {
				setCurrentValue("0");
				setWaitingForOperand(true);
				setShowEquals(false); // 没有第二个操作数时隐藏等号
				setAmount(prev => {
					// 保持操作符，等待输入
					const parts = prev.split(" ");
					return parts.slice(0, 2).join(" ") + " ";
				});
			}
		}
		// 如果正在等待输入第二个操作数（如 "9 + "）
		else if (operator && waitingForOperand) {
			// 情况3：删除操作符（回到 "9"）
			setAmount(firstOperand.toString());
			setCurrentValue(firstOperand.toString());
			setOperator(null);
			setFirstOperand(null);
			setWaitingForOperand(false);
			setShowEquals(false);
		}
		// 如果是纯数字（如 "9"）
		else if (currentValue.length > 1) {
			// 情况4：删除数字的最后一个字符
			const newValue = currentValue.slice(0, -1);
			setCurrentValue(newValue);
			setAmount(newValue);
		}
		// 情况5：重置为0
		else {
			setCurrentValue("0");
			setAmount("0");
			setOperator(null);
			setFirstOperand(null);
			setWaitingForOperand(false);
			setShowEquals(false);
		}
	};

	// 重置计算器
	const resetCalculator = () => {
		setAmount("0.00");
		setCurrentValue("0");
		setFirstOperand(null);
		setOperator(null);
		setWaitingForOperand(false);
		setShowEquals(false);
	};

	// 获取右下角按钮的文本和点击处理函数
	const getBottomRightButtonProps = () => {
		if (showEquals && operator && !waitingForOperand) {
			return {
				text: '=',
				onClick: handleEqualsClick,
				bgColor: '#FFD700'
			};
		} else {
			return {
				text: '完成',
				onClick: handleCompleteClick,
				bgColor: '#FFD700'
			};
		}
	};

	const handleSelectTimeConfirm = (year, month, day) => {
		console.log(`选择日期: ${year}-${month}-${day}`);
		// handleSelectTime(year, month, day);
	};

	const handleOpenSelectTime = (open) => {
		setOpenSelectTime(open);
	};

	const bottomRightButton = getBottomRightButtonProps();

	return (
		<Box
			sx={{
				width: '100%',
				height: "100%",
				backgroundColor: '#ffffff',
				display: 'flex',
				flexDirection: 'column',
				padding: 2,
				boxSizing: 'border-box',
				borderTop: '1px solid #e0e0e0'
			}}
		>
			{/* 输入区域 + 备注 */}
			<Box sx={{ marginBottom: 2, width: '100%' }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						fontSize: '2rem',
						marginBottom: 1,
						minHeight: '2.5rem',
						color: '#333333',
						fontWeight: 'bold',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap'
					}}
				>
					{amount}
				</Box>
				<TextField
					fullWidth
					placeholder="备注：点击填写备注"
					variant="outlined"
					size="small"
					sx={{
						'& .MuiOutlinedInput-root': {
							borderRadius: 1,
							'& fieldset': {
								borderColor: '#e0e0e0',
							}
						}
					}}
				/>
			</Box>

			{/* 键盘区域 - 使用CSS Grid确保严格的4x4布局 */}
			<Box sx={{
				flex: 1,
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)', // 4列
				gridTemplateRows: 'repeat(4, 1fr)',    // 4行
				gap: '8px',                           // 间距
				width: '100%'
			}}>
				{/* 第一行：7 8 9 今天 */}
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('7')}
				>
					7
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('8')}
				>
					8
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('9')}
				>
					9
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleOpenSelectTime(true)}
				>
					<CalendarMonthIcon fontSize="small" />
				</Button>

				{/* 第二行：4 5 6 + */}
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('4')}
				>
					4
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('5')}
				>
					5
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('6')}
				>
					6
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleOperatorClick('+')}
				>
					+
				</Button>

				{/* 第三行：1 2 3 - */}
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('1')}
				>
					1
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('2')}
				>
					2
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('3')}
				>
					3
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleOperatorClick('-')}
				>
					-
				</Button>

				{/* 第四行：. 0 删除键 完成/= */}
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={handleDecimalClick}
				>
					.
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={() => handleNumberClick('0')}
				>
					0
				</Button>
				<Button
					variant="outlined"
					sx={{ borderRadius: 1 }}
					onClick={handleDeleteClick}
				>
					<BackspaceIcon />
				</Button>
				<Button
					variant="contained"
					sx={{
						backgroundColor: bottomRightButton.bgColor,
						color: '#333',
						borderRadius: 1,
						fontWeight: 'bold',
						'&:hover': {
							backgroundColor: '#FFC107',
						}
					}}
					onClick={bottomRightButton.onClick}
				>
					{bottomRightButton.text}
				</Button>
			</Box>
			<SelectTime
				currentYearMonth={{ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }}
				openSelectTime={openSelectTime}
				showDays={true}
				handleOpenSelectTime={handleOpenSelectTime}
				handleSelectTimeConfirm={handleSelectTimeConfirm}
			/>

		</Box>
	);
};

export default Keyboard;