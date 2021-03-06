USE [imobiliario]
GO
/****** Object:  StoredProcedure [dbo].[spCRUDEmployee]    Script Date: 29/11/2019 15:39:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:  	JCLAVO
-- Create date: 28/Novembro/2019
-- Modify date: 28/Novembro/2019
-- Description:	Store de Procedure para CRUD Employee
-- Sistema:		SampleIonic4 - Versão 1.0
-- =============================================

--TEST CASES:

-- CRIAR 
-- EXEC [dbo].[spCRUDEmployee] @StringDataJson = '{\"CodigoUsuarioSistema\":1,\"StatusCRUD\":\"Criar\",\"Employee_id\":\"\",\"formValues\":{\"fullName\":\"AMIT\",\"birthdate\":\"2019-11-29T10:16:17.855-03:00\",\"genre\":\"1\",\"country_id\":\"4\"}}'

-- SALVAR
-- EXEC [dbo].[spCRUDEmployee] @StringDataJson = '{\"CodigoUsuarioSistema\":1,\"StatusCRUD\":\"Salvar\",\"Employee_id\":2,\"formValues\":{\"fullName\":\"AMIT\",\"birthdate\":\"2019-11-29\",\"genre\":\"2\",\"country_id\":\"4\"}}'

-- PESQUISAR BY ID
-- EXEC [dbo].[spCRUDEmployee] @StringDataJson = '{\"CodigoUsuarioSistema\":1,\"StatusCRUD\":\"Pesquisar\",\"Employee_id\":\"3\",\"formValues\":\"\"}'

-- PESQUISAR
-- EXEC [dbo].[spCRUDEmployee] @StringDataJson = '{\"CodigoUsuarioSistema\":1,\"StatusCRUD\":\"Pesquisar\",\"Employee_id\":\"\",\"formValues\":\"\"}'

ALTER PROCEDURE [dbo].[spCRUDEmployee]
	-- Parameters for the stored procedure here
	 @StringDataJson   VARCHAR(MAX) 	
AS
BEGIN

	-->	A -	DECLARA VARIABLES Y CONSTANTES
	--==================================================================================-- 	
	
	-- variável de volta 
	DECLARE @DataJsonResults	NVARCHAR(4000);
	DECLARE @Message			VARCHAR(1000);
	DECLARE @Success			BIT = 0;

	-- variável para autenticar
	DECLARE @RecordCount		INT = 0;

	-- variável JSON
	DECLARE @CodigoUsuarioSistema	BIGINT;
	DECLARE @StatusCRUD				VARCHAR(50);
	DECLARE @HashKey			    VARCHAR(MAX);
	DECLARE @Employee_id		    BIGINT;

	-- variável JSON - FORM
	DECLARE @fullName				VARCHAR(45);
	DECLARE @birthdate				DATE;
	DECLARE @genre					BIGINT;
	DECLARE @country_id				BIGINT;

		-->	B -	LOGICA

	BEGIN TRY --> Control de ejecución

		--> Limpar '/' do JSON, 
		SET @StringDataJson =   REPLACE(@StringDataJson,'\','');  

		--> Pegar JSON dados
		SET @CodigoUsuarioSistema	= JSON_VALUE(@StringDataJson, '$.CodigoUsuarioSistema');
		SET @StatusCRUD				= JSON_VALUE(@StringDataJson, '$.StatusCRUD');
		SET @HashKey				= JSON_VALUE(@StringDataJson, '$.Hashkey')	

		--> Pegar JSON dados - FORM
		SET @employee_id	= JSON_VALUE(@StringDataJson, '$.Employee_id');

		SET @fullName		= JSON_VALUE(@StringDataJson, '$.formValues.fullName');

		-- When it is a date, it needed to be formated
		SET @birthdate		= SUBSTRING(JSON_VALUE(@StringDataJson, '$.formValues.birthdate'), 1, 10);	
		
		SET @genre			= JSON_VALUE(@StringDataJson, '$.formValues.genre');
		SET @country_id		= JSON_VALUE(@StringDataJson, '$.formValues.country_id');

 


		--> Validar usuário 
		SET @CodigoUsuarioSistema = ( SELECT USUARIOS.CodigoUsuario			    
		FROM tblUsuarioSistema USUARIOS WITH (NOLOCK)
		WHERE USUARIOS.CodigoUsuario = @CodigoUsuarioSistema );

		IF (ISNULL(@CodigoUsuarioSistema,0) > 0)
				
			--> Validar usuário session
			BEGIN

				SET @Message = 'Loading...';
				SET @Success = 1;
			
				--> Validar usuário session
				SET @RecordCount = ( SELECT COUNT(USUARIOSESSION.CodigoUsuario)
				FROM tblUsuarioSession USUARIOSESSION WITH (NOLOCK)
				WHERE 
				USUARIOSESSION.CodigoUsuario = @CodigoUsuarioSistema
				AND USUARIOSESSION.DataTimeExpiration IS NULL);
				--AND USUARIOSESSION.DataTimeExpiration IS NULL
				--AND USUARIOSESSION.HashKey = TRIM(@HashKey));
			
				IF (@RecordCount > 0) 

					
					BEGIN
						IF @StatusCRUD = 'Pesquisar'
						BEGIN
							
							
							IF (ISNULL(@employee_id,0) = 0)
								BEGIN 
									SET @DataJsonResults = 
										( SELECT * FROM tblEmployee AS Employee WITH (NOLOCK) 
											FOR JSON PATH );
								END
							ELSE
								BEGIN
									SET @DataJsonResults = 
										( SELECT * FROM tblEmployee AS Employee WITH (NOLOCK)
											WHERE employee_id = @employee_id
											FOR JSON PATH );
								END

							SET @Message = 'Employee gotten';
							SET @Success = 1;

						END

					ELSE IF @StatusCRUD = 'Criar'
						BEGIN
							INSERT INTO tblEmployee (fullName, birthdate, genre, country_id)
									VALUES (@fullName, @birthdate, @genre, @country_id);

							SET @Message = 'Employee created';
							SET @Success = 1;
							SET @DataJsonResults = (SELECT SCOPE_IDENTITY() AS employee_id FOR JSON PATH);
						END

					ELSE IF @StatusCRUD = 'Salvar'
						BEGIN
							UPDATE tblEmployee
							SET fullName   = @fullName,
								birthdate  = @birthdate,
								genre	   = @genre,
								country_id = @country_id
							WHERE employee_id = @employee_id;
							
							SET @Message = 'Employee saved';
							SET @Success = 1;
							SET @DataJsonResults = '';
						END

					ELSE IF @StatusCRUD = 'Apagar'
						BEGIN
							DELETE FROM tblEmployee 
								WHERE employee_id = @employee_id;
							SET @Message = 'Employee deleted';
							SET @Success = 1;
							SET @DataJsonResults = '';
						END
						
													
					END
				ELSE --> ELSE Validar usuário session
				
					BEGIN
						SET @Message = 'Sua Sessão Expirou!!!';
						SET @Success = 0;		
						SET @DataJsonResults = '';
					END
				
				IF (ISNULL(@DataJsonResults,0) = '0') 
					SET @DataJsonResults = '';
					
				SELECT [message] = @Message, [success] = @Success, [DataJsonResults] = @DataJsonResults;
			END
		
		ELSE --> ELSE Validar usuário

			BEGIN
				SET @Message = 'Usuário não disponível. Verifiquei por favor!!!';
				SET @Success = 0
				SELECT  [message] = @Message, [success] = @Success , [DataJsonResults] = '';
			END
		
		
	END TRY
	
	--	Z -	CONTROLE DE EXCESSÃO
	--==================================================================================--
	BEGIN CATCH
		
			IF (@@TRANCOUNT > 0) 
			BEGIN
				ROLLBACK TRANSACTION;
			END;

			SELECT [message] = CONCAT (ERROR_MESSAGE(),'Paramentros Recebido:',@StringDataJson), success = 0, [DataJsonResults] = ''			   
		
			RETURN 1;

	END CATCH

	RETURN 0;

END
